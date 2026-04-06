import sql from '../../config/db.ts';
import { queryBumpTokenVersionAndGetSelfData } from './auth.session.queries.ts';

export { queryBumpTokenVersionAndGetSelfData };

export const queryUpdateUserPassword = async (
  userId: string,
  newPass: string,
): Promise<void> => {
  await sql`
    UPDATE users 
    SET password=${newPass} 
    WHERE id=${userId}::uuid AND auth_provider='app'
  `;
};
