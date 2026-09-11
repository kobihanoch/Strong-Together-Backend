import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { LoginResponse, RefreshTokenPayloadDto, RefreshTokenResponse } from '@strong-together/shared';
import bcrypt from 'bcryptjs';
import { signTokens } from '../../../common/authentication/authentication.utils';
import { appConfig } from '../../../config/app.config';
import { DBService } from '../../../infrastructure/db/db.service';
import type { AppLogger } from '../../../infrastructure/logger';
import { SystemMessagesService } from '../../messages/system-messages/system-messages.service';
import { SessionQueries } from './session.queries';
import { decodeRefreshToken, decodeRefreshTokenForLogout } from './session.utils';

@Injectable()
export class SessionService {
  constructor(
    private readonly dbService: DBService,
    private readonly systemMessagesService: SystemMessagesService,
    private readonly sessionQueries: SessionQueries,
  ) {}

  /**
   * Authenticates user.
   * @param identifier - The username or email address.
   * @param password - The plaintext password.
   * @param jkt - The DPoP key thumbprint.
   * @param requestLogger - The request-scoped logger.
   * @returns The login user result.
   */
  async loginUserData(identifier: string, password: string, jkt: string | undefined, requestLogger: AppLogger): Promise<LoginResponse> {
    if (appConfig.dpopEnabled) {
      if (!jkt) {
        throw new BadRequestException('DPoP-Key-Binding header is missing.');
      }
    }

    const [user = null] = await this.sessionQueries.queryUserByIdentifierForLogin(identifier);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.passwordHash!);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified) throw new UnauthorizedException('A verification email is pending');

    // Credentials are now verified. Continue the same request transaction as
    // this authenticated user before changing session state or sending messages.
    await this.dbService.promoteCurrentRlsTxToAuthenticated(user.id);

    if (user.lastLogin === null) {
      try {
        await this.systemMessagesService.sendSystemMessageToUserWhenFirstLogin(user.id, user.name!);
      } catch (e) {
        requestLogger.error({ err: e, event: 'auth.first_login_message_failed', userId: user.id }, 'Failed to send first-login message');
      }
    }

    const rowsUserData = await this.sessionQueries.queryBumpTokenVersionAndGetSelfData(user.id);
    const [{ tokenVersion, userData }] = rowsUserData;

    const { accessToken, refreshToken } = signTokens(userData.id, userData.role, tokenVersion, '5m', '14d', jkt);

    return {
      message: 'Login successful',
      user: userData?.id,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logs out user.
   * @param refreshToken - The refresh token to process.
   * @param dpopJkt - The verified DPoP key thumbprint for this request.
   */
  async logoutUserData(refreshToken: string | null | undefined, dpopJkt?: string): Promise<void> {
    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');

    const decodedRefresh = decodeRefreshTokenForLogout(refreshToken) as RefreshTokenPayloadDto | null;
    if (!decodedRefresh) throw new UnauthorizedException('Invalid refresh token');

    if (appConfig.dpopEnabled) {
      if (!dpopJkt || !decodedRefresh.cnf?.jkt || decodedRefresh.cnf.jkt !== dpopJkt) {
        throw new UnauthorizedException('Proof-of-Possession failed (JKT mismatch).');
      }
    }

    await this.dbService.promoteCurrentRlsTxToAuthenticated(decodedRefresh.id);
    await this.sessionQueries.queryLogoutUser(decodedRefresh.id);
  }

  /**
   * Refreshes access token.
   * @param refreshToken - The refresh token to process.
   * @param dpopJkt - The DPoP key thumbprint.
   * @returns The refresh access token result.
   */
  async refreshAccessTokenData(refreshToken: string | null | undefined, dpopJkt: string | null | undefined): Promise<RefreshTokenResponse> {
    if (appConfig.dpopEnabled) {
      if (!dpopJkt) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');

    const decoded = decodeRefreshToken(refreshToken ?? null) as RefreshTokenPayloadDto | null;
    if (!decoded) throw new UnauthorizedException('Invalid or expired refresh token');

    if (appConfig.dpopEnabled) {
      const tokenJkt = decoded.cnf?.jkt;
      if (tokenJkt && tokenJkt !== dpopJkt) {
        throw new UnauthorizedException('Proof-of-Possession failed (JKT mismatch).');
      }
    }

    await this.dbService.promoteCurrentRlsTxToAuthenticated(decoded.id);
    const [user = null] = await this.sessionQueries.queryBumpTokenVersionAndGetSelfDataCAS(decoded.id, decoded.tokenVer);
    if (!user) throw new UnauthorizedException('New login required');
    if (!user.userData.isVerified) throw new UnauthorizedException('A verification email is pending');

    const { tokenVersion, userData } = user;

    const { accessToken: newAccess, refreshToken: newRefresh } = signTokens(
      userData.id,
      userData.role,
      tokenVersion,
      '5m',
      '14d',
      dpopJkt ?? undefined,
    );

    return {
      message: 'Access token refreshed',
      accessToken: newAccess,
      refreshToken: newRefresh,
      userId: userData.id,
    };
  }
}
