import { describe, expect, it } from 'vitest';
import { processUserForm } from './formHandler';
import { makeDb } from './test-helpers';

const form = (data: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) fd.set(k, v);
  return fd;
};

describe('processUserForm', () => {
  it('inserta un usuario válido y redirige a /', async () => {
    const { db, stmt } = makeDb();
    const to = await processUserForm(form({ name: 'Ana', email: 'ana@x.com' }), db);
    expect(to).toBe('/');
    expect(stmt.bind).toHaveBeenCalledWith('Ana', 'ana@x.com');
  });

  it('ignora a los bots (honeypot) sin tocar la base', async () => {
    const { db, prepare } = makeDb();
    const to = await processUserForm(form({ website: 'spam', name: 'Bot', email: 'b@b.com' }), db);
    expect(to).toBe('/');
    expect(prepare).not.toHaveBeenCalled();
  });

  it('redirige con error si el email es inválido', async () => {
    const { db, prepare } = makeDb();
    expect(await processUserForm(form({ name: 'Ana', email: 'x' }), db)).toBe('/?error=invalid_email');
    expect(prepare).not.toHaveBeenCalled();
  });

  it('redirige con error si falta el nombre', async () => {
    const { db } = makeDb();
    expect(await processUserForm(form({ name: ' ', email: 'a@b.com' }), db)).toBe('/?error=invalid_name');
  });

  it('elimina por id válido', async () => {
    const { db, stmt } = makeDb();
    expect(await processUserForm(form({ _action: 'delete', id: '3' }), db)).toBe('/');
    expect(stmt.bind).toHaveBeenCalledWith(3);
  });

  it('rechaza ids inválidos al eliminar', async () => {
    const { db, prepare } = makeDb();
    expect(await processUserForm(form({ _action: 'delete', id: '1 OR 1=1' }), db)).toBe('/?error=invalid_id');
    expect(prepare).not.toHaveBeenCalled();
  });

  it('maneja fallos de la base de datos', async () => {
    const { db, run } = makeDb();
    run.mockRejectedValueOnce(new Error('D1 down'));
    expect(await processUserForm(form({ name: 'Ana', email: 'a@b.com' }), db)).toBe('/?error=server');
  });
});
