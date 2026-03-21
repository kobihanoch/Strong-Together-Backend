import type { AuthenticatedUser } from './dto/auth.dto.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      dpopJkt?: string;
      dpopAth?: string;
    }
  }
}

export {};
