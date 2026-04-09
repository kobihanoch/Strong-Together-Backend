import { UserEntity } from '@strong-together/shared';
import type { Logger } from 'pino';

export interface AuthenticatedUser {
  id: UserEntity['id'];
  role: UserEntity['role'];
  is_verified: UserEntity['is_verified'];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      dpopJkt?: string;
      dpopAth?: string;
      requestId: string;
      logger: Logger;
    }
  }
}

export {};
