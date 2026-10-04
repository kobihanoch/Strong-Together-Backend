import type { Request } from 'express';
import type { Logger } from 'pino';

/** Represents the authenticated user value. */
export type AuthenticatedUser = {
  id: string;
  role: string;
};

/** Represents the app request value. */
export type AppRequest = Request & {
  user?: AuthenticatedUser;
  dpopJkt?: string;
  dpopAth?: string;
  requestId: string;
  logger: Logger;
};
