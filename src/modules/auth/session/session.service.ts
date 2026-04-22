import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AccessTokenPayload, LoginResponse, RefreshTokenResponse } from '@strong-together/shared';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../../config/app.config';
import { authConfig } from '../../../config/auth.config';
import type { AppLogger } from '../../../infrastructure/logger';
import { SystemMessagesService } from '../../messages/system-messages/system-messages.service';
import { SessionQueries } from './session.queries';
import { decodeRefreshToken } from './session.utils';

@Injectable()
export class SessionService {
  constructor(
    private readonly systemMessagesService: SystemMessagesService,
    private readonly sessionQueries: SessionQueries,
  ) {}

  async loginUserData(
    identifier: string,
    password: string,
    jkt: string | undefined,
    requestLogger: AppLogger,
  ): Promise<LoginResponse> {
    if (appConfig.dpopEnabled) {
      if (!jkt) {
        throw new BadRequestException('DPoP-Key-Binding header is missing.');
      }
    }

    const [user = null] = await this.sessionQueries.queryUserByIdentifierForLogin(identifier);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.is_verified) {
      throw new UnauthorizedException('You need to verify you account');
    }

    if (user.is_first_login) {
      await this.sessionQueries.querySetUserFirstLoginFalse(user.id);
      try {
        await this.systemMessagesService.sendSystemMessageToUserWhenFirstLogin(user.id, user.name!);
      } catch (e) {
        requestLogger.error(
          { err: e, event: 'auth.first_login_message_failed', userId: user.id },
          'Failed to send first-login message',
        );
      }
    }

    const rowsUserData = await this.sessionQueries.queryBumpTokenVersionAndGetSelfData(user.id);
    const [{ token_version, user_data: userData }] = rowsUserData;

    const cnfClaim = jkt
      ? {
          cnf: {
            jkt: jkt.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''),
          },
        }
      : {};

    const accessToken = jwt.sign(
      {
        id: userData.id,
        role: userData.role,
        tokenVer: token_version,
        ...cnfClaim,
      },
      authConfig.jwtAccessSecret,
      { expiresIn: '5m' },
    );

    const refreshToken = jwt.sign(
      {
        id: userData.id,
        role: userData.role,
        tokenVer: token_version,
        ...cnfClaim,
      },
      authConfig.jwtRefreshSecret,
      { expiresIn: '14d' },
    );

    return {
      message: 'Login successful',
      user: userData?.id,
      accessToken,
      refreshToken,
    };
  }

  async logoutUserData(refreshToken: string | null | undefined): Promise<void> {
    const decodedRefresh = decodeRefreshToken(refreshToken ?? null) as AccessTokenPayload | null;

    if (decodedRefresh) {
      await Promise.all([
        this.sessionQueries.queryUpdateExpoPushTokenToNull(decodedRefresh.id),
        this.sessionQueries.queryBumpTokenVersionAndGetSelfData(decodedRefresh.id),
      ]);
    }
  }

  async refreshAccessTokenData(
    refreshToken: string | null | undefined,
    dpopJkt: string | null | undefined,
  ): Promise<RefreshTokenResponse> {
    if (appConfig.dpopEnabled) {
      if (!dpopJkt) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');

    const decoded = decodeRefreshToken(refreshToken ?? null) as AccessTokenPayload | null;
    if (!decoded) throw new UnauthorizedException('Invalid or expired refresh token');

    if (appConfig.dpopEnabled) {
      const tokenJkt = decoded.cnf?.jkt;
      if (tokenJkt && tokenJkt !== dpopJkt) {
        throw new UnauthorizedException('Proof-of-Possession failed (JKT mismatch).');
      }
    }

    const [user = null] = await this.sessionQueries.queryBumpTokenVersionAndGetSelfDataCAS(decoded.id, decoded.tokenVer);
    if (!user) throw new UnauthorizedException('New login required');

    const { token_version, user_data: userData } = user;

    const cnfClaim = dpopJkt
      ? {
          cnf: {
            jkt: dpopJkt.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''),
          },
        }
      : {};

    const newAccess = jwt.sign(
      {
        id: userData.id,
        role: userData.role,
        tokenVer: token_version,
        ...cnfClaim,
      },
      authConfig.jwtAccessSecret,
      { expiresIn: '5m' },
    );

    const newRefresh = jwt.sign(
      {
        id: userData.id,
        role: userData.role,
        tokenVer: token_version,
        ...cnfClaim,
      },
      authConfig.jwtRefreshSecret,
      { expiresIn: '14d' },
    );

    return {
      message: 'Access token refreshed',
      accessToken: newAccess,
      refreshToken: newRefresh,
      userId: userData.id,
    };
  }
}
