import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AccessTokenPayloadDto } from '@strong-together/shared';
import * as crypto from 'crypto';
import { appConfig } from '../../config/app.config';
import { applySentryRequestContext } from '../../infrastructure/sentry';
import { decodeAccessToken, getAccessToken } from '../authentication/authentication.utils';
import type { AppRequest } from '../types/express';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AppRequest>();
    const dpopJkt = req.dpopJkt;

    if (appConfig.dpopEnabled) {
      if (!dpopJkt) {
        throw new UnauthorizedException('Internal error: DPoP JKT not found on request.');
      }
    }

    // Get access token
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      throw new UnauthorizedException('No access token provided');
    }

    // Decode
    const decoded = decodeAccessToken(accessToken) as unknown as AccessTokenPayloadDto;
    if (!decoded) {
      throw new UnauthorizedException('Access token is not valid');
    }

    // Check if access token JKT is equal to DPoP JKT
    if (appConfig.dpopEnabled) {
      const tokenJkt = decoded.cnf?.jkt;

      if (!tokenJkt || tokenJkt !== dpopJkt) {
        throw new UnauthorizedException('Proof-of-Possession failed (JKT mismatch).');
      }

      const currentAth = crypto
        .createHash('sha256')
        .update(accessToken, 'ascii')
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      if (currentAth !== req.dpopAth) throw new UnauthorizedException("DPoP ath doesn't match.");
    }

    // Inject to request
    const { id, role } = decoded;
    const user = { id, role };
    req.user = user;
    if (req.logger) {
      req.logger = req.logger.child({
        userId: user.id,
        role: user.role,
      });
    }
    applySentryRequestContext(req);

    return true;
  }
}
