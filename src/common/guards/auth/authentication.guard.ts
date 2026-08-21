import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { AccessTokenPayloadDto } from '@strong-together/shared';
import * as crypto from 'crypto';
import type postgres from 'postgres';
import { appConfig } from '../../../config/app.config';
import { SQL } from '../../../infrastructure/db/db.tokens';
import { DBService } from '../../../infrastructure/db/db.service';
import { applySentryRequestContext } from '../../../infrastructure/sentry';
import { SessionQueries } from '../../../modules/auth/session/session.queries';
import { decodeAccessToken, getAccessToken } from '../../authentication/authentication.utils';
import type { AppRequest, AuthenticatedUser } from '../../types/express';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(SQL) private readonly sql: postgres.Sql,
    private readonly dbService: DBService,
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

    // Guards run before interceptors, so establish the authenticated RLS role
    // while validating the token and loading its user.
    const { versionData, user } = await this.dbService.runWithRlsTx(decoded.id, async () => {
      const [currentVersion] = await this.sessionQueries.queryGetCurrentTokenVersion(decoded.id);
      const [currentUser]: [AuthenticatedUser?] = await this.sql`
        SELECT id, role, is_verified AS "isVerified" FROM identity.user WHERE id=${decoded.id}::uuid
      `;
      return { versionData: currentVersion, user: currentUser };
    });

    if (!versionData || decoded.tokenVer !== versionData.tokenVersion) {
      throw new UnauthorizedException('New login required');
    }

    // If user not found
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user?.isVerified) {
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
