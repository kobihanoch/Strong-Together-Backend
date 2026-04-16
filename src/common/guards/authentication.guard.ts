import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { AccessTokenPayload } from '@strong-together/shared';
import * as crypto from 'crypto';
import type postgres from 'postgres';
import { appConfig } from '../../config/app.config.ts';
import { SQL } from '../../infrastructure/db/db.tokens.ts';
import { applySentryRequestContext } from '../../infrastructure/sentry.ts';
import { SessionQueries } from '../../modules/auth/session/session.queries.ts';
import { decodeAccessToken, getAccessToken } from '../authentication/authentication.utils.ts';
import type { AppRequest, AuthenticatedUser } from '../types/express.ts';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(SQL) private readonly sql: postgres.Sql,
    private readonly sessionQueries: SessionQueries,
  ) {}

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
    const decoded = decodeAccessToken(accessToken) as unknown as AccessTokenPayload;
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

    const [versionData] = await this.sessionQueries.queryGetCurrentTokenVersion(decoded.id);
    if (!versionData || decoded.tokenVer !== versionData.token_version) {
      throw new UnauthorizedException('New login required');
    }

    // Fetch user id and role
    const [user]: [AuthenticatedUser?] = await this.sql`
      SELECT id, role, is_verified FROM users WHERE id=${decoded.id}::uuid
    `;

    // If user not found
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user?.is_verified) {
      throw new UnauthorizedException('A validation email is pending.');
    }

    // Inject to request
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
