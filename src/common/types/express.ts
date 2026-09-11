import type { Request } from 'express';
import type { Logger } from 'pino';
import type { UserRow } from '@strong-together/shared';

export type AuthenticatedUser = {
  id: UserRow['id'];
  role: UserRow['role'];
};

export type AppRequest = Request & {
  user?: AuthenticatedUser;
  dpopJkt?: string;
  dpopAth?: string;
  requestId: string;
  logger: Logger;
};
