import { createUser, deleteUser, type DbLike } from './users';
import { isHoneypotTriggered, parseId, validateUserInput } from './validation';

export async function processUserForm(formData: FormData, db: DbLike): Promise<string> {
  if (isHoneypotTriggered(formData.get('website'))) return '/';

  try {
    if (formData.get('_action') === 'delete') {
      const id = parseId(formData.get('id'));
      if (id === null) return '/?error=invalid_id';
      await deleteUser(db, id);
      return '/';
    }

    const result = validateUserInput(formData.get('name'), formData.get('email'));
    if (!result.ok) return `/?error=${result.error}`;
    await createUser(db, result.value);
    return '/';
  } catch {
    return '/?error=server';
  }
}
