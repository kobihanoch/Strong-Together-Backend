import sql from '../../../config/db.ts';
import { UserByIndetifier } from '../../../types/dto/auth.dto.ts';

export async function queryUserByUsername(
  username: string,
): Promise<UserByIndetifier[]> {
  return sql<UserByIndetifier[]>`
    SELECT id, name, username, password, role, is_first_login, is_verified
    FROM users 
    WHERE username=${username} 
    LIMIT 1
  `;
}

export const queryUpdateUserVerficiationStatus = async (
  userId: string,
  state: boolean,
): Promise<void> => {
  await sql`UPDATE users SET is_verified = ${state} WHERE users.id = ${userId}::uuid`;
};
