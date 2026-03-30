import type { AuthenticatedUser } from './dto/auth.dto.ts';
import type { Logger } from 'pino';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      dpopJkt?: string;
      dpopAth?: string;
      requestId?: string;
      logger?: Logger;
    }
  }
}

export {};
