import { vi } from 'vitest';
import type { DbLike } from './users';

export function makeDb(results: unknown[] = []) {
  const run = vi.fn().mockResolvedValue({});
  const all = vi.fn().mockResolvedValue({ results });
  const stmt: any = { run, all };
  stmt.bind = vi.fn(() => stmt);
  const prepare = vi.fn(() => stmt);
  return { db: { prepare } as unknown as DbLike, prepare, stmt, run, all };
}
