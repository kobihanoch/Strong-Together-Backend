import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import sql from '../../../infrastructure/db.client.ts';
import { queryUpdateUserVerficiationStatus, queryUserByUsername } from './verification.queries.ts';
import { queryUserExistsByUsernameOrEmail } from '../../user/create/create.queries.ts';
import { sendVerificationEmail } from './verification-emails/verification-emails.service.ts';
import { generateVerificationFailedHTML, generateVerifiedHTML } from './verification.views.ts';
import type { ChangeEmailAndVerifyBody, SendVerifcationMailBody } from '@strong-together/shared';
import { cacheStoreJti } from '../../../infrastructure/cache/redis.cache.ts';
import { decodeVerifyToken } from './verification.utils.ts';

@Injectable()
export class VerificationService {
  async verifyUserAccountData(token: string | undefined): Promise<{ statusCode: number; html: string }> {
    if (!token) throw new BadRequestException('Missing token');
    const decoded = decodeVerifyToken(token);
    if (!decoded) {
      return { statusCode: 401, html: generateVerificationFailedHTML() };
    }

    const { jti, sub, exp, iss, typ } = decoded;
    if (iss !== 'strong-together' || typ !== 'email-verify' || !jti || !sub) {
      return { statusCode: 400, html: generateVerificationFailedHTML() };
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const ttlSec = Math.max(1, exp - nowSec);

    const inserted = await cacheStoreJti('accountverify', jti, ttlSec);
    if (!inserted) {
      return { statusCode: 401, html: generateVerificationFailedHTML() };
    }

    await queryUpdateUserVerficiationStatus(sub, true);
    return { statusCode: 200, html: generateVerifiedHTML() };
  }

  async sendVerificationMailData(body: SendVerifcationMailBody, requestId?: string): Promise<void> {
    const { email } = body;
    const [user = null] = await sql<{ id: string; name: string | null; username: string }[]>`
      SELECT id, name, username FROM users WHERE email=${email}`;
    if (!user) return;
    const { id, name } = user;
    await sendVerificationEmail(email, id, name ?? user.username, {
      ...(requestId ? { requestId } : {}),
    });
  }

  async changeEmailAndVerifyData(body: ChangeEmailAndVerifyBody, requestId?: string): Promise<void> {
    const { username, password, newEmail } = body;

    const [user = null] = await queryUserByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password!);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (user.is_verified) throw new BadRequestException('Account already verified');

    const [exists] = await queryUserExistsByUsernameOrEmail(null, newEmail);
    if (exists) throw new ConflictException('Email already in use');

    await sql`UPDATE users SET email = ${newEmail} WHERE id = ${user.id}::uuid`;
    await sendVerificationEmail(newEmail, user.id, user.name ? user.name : user.username!, {
      ...(requestId ? { requestId } : {}),
    });
  }

  async checkUserVerifyData(username: string): Promise<{ isVerified: boolean }> {
    const [user] = await sql<{ is_verified: boolean }[]>`SELECT is_verified FROM users WHERE username=${username}`;
    return { isVerified: user?.is_verified ?? false };
  }
}
