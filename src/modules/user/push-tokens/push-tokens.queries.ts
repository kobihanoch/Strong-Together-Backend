import sql from '../../../infrastructure/db.client.ts';

export const querySaveUserPushToken = async (userId: string, token: string): Promise<void> => {
  await sql`UPDATE users SET push_token=${token} WHERE id=${userId}::uuid`;
};
