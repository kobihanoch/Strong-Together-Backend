import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ResetPasswordResponse, SendChangePassEmailBody } from '@strong-together/shared';
import bcrypt from 'bcryptjs';
import { cacheStoreJti } from '../../../infrastructure/cache/cache.service.ts';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens.ts';
import { sendForgotPasswordEmail } from './password-emails/password-emails.service.ts';
import { PasswordQueries } from './password.queries.ts';
import { SessionQueries } from '../session/session.queries.ts';
import { decodeForgotPasswordToken } from './password.utils.ts';

@Injectable()
export class PasswordService {
  constructor(
    @Inject(SQL) private readonly sql: postgres.Sql,
    private readonly passwordQueries: PasswordQueries,
    private readonly sessionQueries: SessionQueries,
  ) {}

  async sendChangePassEmailData(body: SendChangePassEmailBody, requestId?: string): Promise<void> {
    const { identifier } = body;
    if (!identifier) throw new BadRequestException('Please fill username or email');
    const [user = null] = await this.sql<
      { id: string; email: string; name: string; username: string }[]
    >`SELECT id, email, name, username FROM users WHERE 
        auth_provider='app' 
        AND (username=${identifier} OR email=${identifier}) LIMIT 1`;
    if (!user) return;

    await sendForgotPasswordEmail(user.email, user.id, user.name ? user.name : user.username, {
      ...(requestId ? { requestId } : {}),
    });
  }

  async resetPasswordData(token: string | undefined, newPassword: string): Promise<ResetPasswordResponse> {
    if (!token) throw new BadRequestException('Missing token');
    const decoded = decodeForgotPasswordToken(token);
    if (!decoded) {
      throw new BadRequestException('Verfication token is not valid');
    }

    const { jti, sub, exp, iss, typ } = decoded;
    if (iss !== 'strong-together' || typ !== 'forgot-pass' || !jti || !sub) {
      throw new BadRequestException('Verfication token is not valid');
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const ttlSec = Math.max(1, exp - nowSec);

    const inserted = await cacheStoreJti('forgotpassword', jti, ttlSec);
    if (!inserted) {
      throw new BadRequestException('URL already used or expired');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    await Promise.all([
      this.passwordQueries.queryUpdateUserPassword(sub, hash),
      this.sessionQueries.queryBumpTokenVersionAndGetSelfData(sub),
    ]);
    return { ok: true };
  }
}
