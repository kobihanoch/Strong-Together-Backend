import sql from '../../../infrastructure/db.client.ts';
import type { TokenVersionResult, UserAfterBump } from '@strong-together/shared';
import { UserByIndetifier } from '@strong-together/shared';

export async function queryUserByIdentifierForLogin(identifier: string): Promise<UserByIndetifier[]> {
  return sql<UserByIndetifier[]>`
    SELECT 
      id, name, username, password, is_first_login, is_verified, role
    FROM 
      users 
    WHERE 
      auth_provider='app' 
      AND (username=${identifier} OR email=${identifier})
    LIMIT 1;
  `;
}

export async function querySetUserFirstLoginFalse(userId: string): Promise<{ id: string }[]> {
  return sql<{ id: string }[]>`
    UPDATE users SET is_first_login=FALSE WHERE id=${userId}::uuid RETURNING id
  `;
}

export async function queryBumpTokenVersionAndGetSelfData(userId: string): Promise<UserAfterBump[]> {
  return sql<UserAfterBump[]>`
    UPDATE users 
    SET token_version = token_version + 1 
    WHERE id = ${userId}::uuid 
    RETURNING token_version, (to_jsonb(users) - 'password' - 'token_version') AS user_data
  `;
}

export async function queryBumpTokenVersionAndGetSelfDataCAS(
  userId: string,
  prevTokenVer: number,
): Promise<UserAfterBump[]> {
  return sql<UserAfterBump[]>`
    UPDATE users 
    SET token_version = token_version + 1 
    WHERE id = ${userId}::uuid AND token_version = ${prevTokenVer} 
    RETURNING token_version, (to_jsonb(users) - 'password' - 'token_version') AS user_data
  `;
}

export const queryGetCurrentTokenVersion = async (userId: string): Promise<TokenVersionResult[]> => {
  return sql<TokenVersionResult[]>`
    SELECT token_version FROM users WHERE id=${userId}::uuid
  `;
};

export const queryUpdateExpoPushTokenToNull = async (userId: string): Promise<void> => {
  await sql`UPDATE users SET push_token=NULL WHERE id=${userId}::uuid`;
};
