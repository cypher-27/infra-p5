import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDeployDate } from './formatDate';

describe('formatDeployDate', () => {
  afterEach(() => vi.useRealTimers());

  it('formatea una fecha en español (es-MX)', () => {
    expect(formatDeployDate(new Date(2026, 8, 19, 12))).toBe('19 de septiembre de 2026');
  });

  it.each([
    [new Date(2026, 0, 1, 12), '1 de enero de 2026'],
    [new Date(2026, 11, 31, 12), '31 de diciembre de 2026'],
    [new Date(2028, 1, 29, 12), '29 de febrero de 2028'],
  ])('formatea %s', (fecha, esperado) => {
    expect(formatDeployDate(fecha)).toBe(esperado);
  });

  it('usa la fecha actual cuando no hay argumento', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 2, 12));
    expect(formatDeployDate()).toBe('2 de octubre de 2026');
  });

  it('regresa un texto seguro con fecha inválida', () => {
    expect(formatDeployDate(new Date('no-es-fecha'))).toBe('Fecha no disponible');
  });
});
