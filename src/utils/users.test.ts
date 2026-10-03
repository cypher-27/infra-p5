import { describe, expect, it } from 'vitest';
import { createUser, deleteUser, listUsers } from './users';
import { makeDb } from './test-helpers';

describe('users repository', () => {
  it('listUsers ordena por id y regresa filas', async () => {
    const rows = [{ id: 1, name: 'Ana', email: 'a@b.com' }];
    const { db, prepare } = makeDb(rows);
    await expect(listUsers(db)).resolves.toEqual(rows);
    expect(prepare).toHaveBeenCalledWith('SELECT * FROM users ORDER BY id ASC');
  });

  it('listUsers regresa [] si results es undefined', async () => {
    const { db, all } = makeDb();
    all.mockResolvedValueOnce({});
    await expect(listUsers(db)).resolves.toEqual([]);
  });

  it('createUser usa parámetros bind (no concatena SQL)', async () => {
    const { db, prepare, stmt, run } = makeDb();
    await createUser(db, { name: 'Ana', email: 'a@b.com' });
    expect(prepare).toHaveBeenCalledWith('INSERT INTO users (name, email) VALUES (?, ?)');
    expect(stmt.bind).toHaveBeenCalledWith('Ana', 'a@b.com');
    expect(run).toHaveBeenCalledOnce();
  });

  it('deleteUser borra por id', async () => {
    const { db, prepare, stmt } = makeDb();
    await deleteUser(db, 5);
    expect(prepare).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?');
    expect(stmt.bind).toHaveBeenCalledWith(5);
  });
});
