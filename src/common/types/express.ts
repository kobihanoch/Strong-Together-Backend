import type { Request } from 'express';
import type { Logger } from 'pino';
import type { UserEntity } from '@strong-together/shared';

export type AuthenticatedUser = {
  id: UserEntity['id'];
  role: UserEntity['role'];
  is_verified: UserEntity['is_verified'];
};

export type AppRequest = Request & {
  user?: AuthenticatedUser;
  dpopJkt?: string;
  dpopAth?: string;
  requestId: string;
  logger: Logger;
};
