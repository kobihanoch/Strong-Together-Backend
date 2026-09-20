import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../../../config/auth.config';
import { CacheService } from '../../../../infrastructure/cache/cache.service';
import type { EmailChangeClaims } from '../application/models/update-user.models';
import { EmailChangeTokens } from '../application/ports/email-change-tokens.port';
/** JWT and cache adapter for one-time email-change tokens. */ @Injectable()
export class JwtEmailChangeTokens implements EmailChangeTokens {
  constructor(private readonly cache: CacheService) {}
  verify(token: string): EmailChangeClaims | null {
    try {
      return jwt.verify(token, authConfig.changeEmailSecret) as EmailChangeClaims;
    } catch {
      return null;
    }
  }
  consume(jti: string, expiresAt: number): Promise<boolean> {
    return this.cache.cacheStoreJti('emailchange', jti, Math.max(1, expiresAt - Math.floor(Date.now() / 1000)));
  }
}
