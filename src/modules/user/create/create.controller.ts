import { Request, Response } from 'express';
import { createUserData } from './create.service.ts';
import type { CreateUserBody, CreateUserResponse } from '@strong-together/shared';

/**
 * Register a new local user account.
 *
 * Creates the user, initializes default reminder settings, and sends the first
 * verification email.
 *
 * Route: POST /api/users/create
 * Access: Public
 */
export const createUser = async (
  req: Request<{}, CreateUserResponse, CreateUserBody>,
  res: Response<CreateUserResponse>,
): Promise<void | Response> => {
  const payload = await createUserData(req.body, req.requestId);
  return res.status(201).json(payload);
};
