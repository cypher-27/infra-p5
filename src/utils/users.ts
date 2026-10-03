export interface UserRow {
  id: number;
  name: string;
  email: string;
}

export interface StatementLike {
  bind(...values: unknown[]): StatementLike;
  run(): Promise<unknown>;
  all<T = unknown>(): Promise<{ results: T[] }>;
}
export interface DbLike {
  prepare(query: string): StatementLike;
}

export async function listUsers(db: DbLike): Promise<UserRow[]> {
  const { results } = await db
    .prepare('SELECT * FROM users ORDER BY id ASC')
    .all<UserRow>();
  return results ?? [];
}

export async function createUser(db: DbLike, u: { name: string; email: string }) {
  await db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').bind(u.name, u.email).run();
}

export async function deleteUser(db: DbLike, id: number) {
  await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
}
