export type ValidationError = 'invalid_name' | 'invalid_email';

export type ValidationResult =
  | { ok: true; value: { name: string; email: string } }
  | { ok: false; error: ValidationError };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 100;

const asText = (v: FormDataEntryValue | null): string =>
  typeof v === 'string' ? v.trim().slice(0, MAX_LEN) : '';

export function isHoneypotTriggered(v: FormDataEntryValue | null): boolean {
  return typeof v === 'string' ? v.length > 0 : v !== null;
}

export function parseId(v: FormDataEntryValue | null): number | null {
  if (typeof v !== 'string' || !/^\d+$/.test(v.trim())) return null;
  const n = Number(v);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export function validateUserInput(
  nameRaw: FormDataEntryValue | null,
  emailRaw: FormDataEntryValue | null,
): ValidationResult {
  const name = asText(nameRaw);
  if (!name) return { ok: false, error: 'invalid_name' };
  const email = asText(emailRaw).toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'invalid_email' };
  return { ok: true, value: { name, email } };
}
