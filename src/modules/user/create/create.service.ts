import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import { queryInsertUser, queryUserExistsByUsernameOrEmail } from './create.queries.ts';
import { sendVerificationEmail } from '../../../shared/services/emailService.ts';
import type { CreateUserBody } from '../../../shared/types/api/user/requests.ts';
import type { CreateUserResponse } from '../../../shared/types/api/user/responses.ts';

export const createUserData = async (body: CreateUserBody, requestId?: string): Promise<CreateUserResponse> => {
  const { username, fullName, email, password, gender } = body;
  const rowsExists = await queryUserExistsByUsernameOrEmail(username, email);
  const [user] = rowsExists;
  if (user) throw createError(400, 'User already exists');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const created = await queryInsertUser(username!, fullName, email!, gender, hash);

  await sendVerificationEmail(email as string, created.id, fullName, {
    ...(requestId ? { requestId } : {}),
  });

  return { message: 'User created successfully!', user: created };
};
