import { describe, it, expect } from 'vitest';
import { formatDeployDate } from './formatDate';

describe('formatDeployDate', () => {
  it('formatea una fecha en español (es-MX)', () => {
    const fecha = new Date('2026-09-19T12:00:00');
    expect(formatDeployDate(fecha)).toBe('19 de septiembre de 2026');
  });

  it('usa la fecha actual si no se le pasa argumento', () => {
    const resultado = formatDeployDate();
    expect(typeof resultado).toBe('string');
    expect(resultado.length).toBeGreaterThan(0);
  });
});
