import { describe, expect, it } from 'vitest';
import { GET } from './health';

describe('GET /api/health', () => {
  it('responde 200 con status ok', async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
    expect(res.headers.get('cache-control')).toBe('no-store');
  });
});
