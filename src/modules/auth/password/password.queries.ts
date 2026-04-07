import sql from '../../../infrastructure/db.client.ts';
import { queryBumpTokenVersionAndGetSelfData } from '../session/session.queries.ts';

export { queryBumpTokenVersionAndGetSelfData };

export const queryUpdateUserPassword = async (userId: string, newPass: string): Promise<void> => {
  await sql`
    UPDATE users 
    SET password=${newPass} 
    WHERE id=${userId}::uuid AND auth_provider='app'
  `;
};
