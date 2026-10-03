import { describe, expect, it } from 'vitest';
import { isHoneypotTriggered, parseId, validateUserInput } from './validation';

describe('validateUserInput', () => {
  it('acepta datos válidos y normaliza', () => {
    expect(validateUserInput('  Ana  ', ' ANA@Correo.com ')).toEqual({
      ok: true,
      value: { name: 'Ana', email: 'ana@correo.com' },
    });
  });

  it.each([[null], [''], ['   ']])('rechaza nombre vacío (%j)', (n) => {
    expect(validateUserInput(n, 'a@b.com')).toEqual({ ok: false, error: 'invalid_name' });
  });

  it.each([[null], [''], ['sin-arroba'], ['a@b'], ['a b@c.com'], ['@x.com'], ['a@.com ']])(
    'rechaza email inválido (%j)',
    (e) => {
      expect(validateUserInput('Ana', e)).toEqual({ ok: false, error: 'invalid_email' });
    },
  );

  it('recorta a 100 caracteres', () => {
    const r = validateUserInput('x'.repeat(300), 'a@b.com');
    expect(r.ok && r.value.name.length).toBe(100);
  });

  it('rechaza archivos (File) como entrada', () => {
    const file = new File(['x'], 'x.txt');
    expect(validateUserInput(file, 'a@b.com').ok).toBe(false);
  });

  it('no interpreta SQL: lo deja como texto', () => {
    const r = validateUserInput("Robert'); DROP TABLE users;--", 'a@b.com');
    expect(r.ok).toBe(true);
  });
});

describe('parseId', () => {
  it.each([['1', 1], ['42', 42], [' 7 ', 7]])('parsea %j', (v, esperado) => {
    expect(parseId(v)).toBe(esperado);
  });
  it.each([[null], [''], ['0'], ['-1'], ['1.5'], ['abc'], ['1; DROP'], ['99999999999999999999']])(
    'rechaza %j',
    (v) => expect(parseId(v)).toBeNull(),
  );
});

describe('isHoneypotTriggered', () => {
  it('es falso si está vacío o ausente', () => {
    expect(isHoneypotTriggered(null)).toBe(false);
    expect(isHoneypotTriggered('')).toBe(false);
  });
  it('es verdadero si un bot lo llenó', () => {
    expect(isHoneypotTriggered('http://spam.com')).toBe(true);
  });
});
