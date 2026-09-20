import type { Request } from 'express';
import type { Logger } from 'pino';

export type AuthenticatedUser = {
  id: string;
  role: string;
};

export type AppRequest = Request & {
  user?: AuthenticatedUser;
  dpopJkt?: string;
  dpopAth?: string;
  requestId: string;
  logger: Logger;
};
