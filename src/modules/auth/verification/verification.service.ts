import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';
import { VerificationQueries } from './verification.queries';
import { CreateUserQueries } from '../../user/create/create.queries';
import { VerificationEmailsService } from './verification-emails/verification-emails.service';
import { generateVerificationFailedHTML, generateVerifiedHTML } from './verification.views';
import type { ChangeEmailAndVerifyBody, SendVerifcationMailBody } from '@strong-together/shared';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import { decodeVerifyToken } from './verification.utils';

@Injectable()
export class VerificationService {
  constructor(
    @Inject(SQL) private readonly sql: postgres.Sql,
    private readonly verificationQueries: VerificationQueries,
    private readonly createUserQueries: CreateUserQueries,
    private readonly verificationEmailsService: VerificationEmailsService,
    private readonly cacheSerice: CacheService,
  ) {}

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

    const inserted = await this.cacheSerice.cacheStoreJti('accountverify', jti, ttlSec);
    if (!inserted) {
      return { statusCode: 401, html: generateVerificationFailedHTML() };
    }

    await this.verificationQueries.queryUpdateUserVerficiationStatus(sub, true);
    return { statusCode: 200, html: generateVerifiedHTML() };
  }

  async sendVerificationMailData(body: SendVerifcationMailBody, requestId?: string): Promise<void> {
    const { email } = body;
    const [user = null] = await this.sql<{ id: string; name: string | null; username: string }[]>`
      SELECT id, name, username FROM identity.users WHERE email=${email}`;
    if (!user) return;
    const { id, name } = user;
    await this.verificationEmailsService.sendVerificationEmail(email, id, name ?? user.username, {
      ...(requestId ? { requestId } : {}),
    });
  }

  async changeEmailAndVerifyData(body: ChangeEmailAndVerifyBody, requestId?: string): Promise<void> {
    const { username, password, newEmail } = body;

    const [user = null] = await this.verificationQueries.queryUserByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password!);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (user.is_verified) throw new BadRequestException('Account already verified');

    const [exists] = await this.createUserQueries.queryUserExistsByUsernameOrEmail(null, newEmail);
    if (exists) throw new ConflictException('Email already in use');

    await this.sql`UPDATE identity.users SET email = ${newEmail} WHERE id = ${user.id}::uuid`;
    await this.verificationEmailsService.sendVerificationEmail(
      newEmail,
      user.id,
      user.name ? user.name : user.username!,
      {
        ...(requestId ? { requestId } : {}),
      },
    );
  }

  async checkUserVerifyData(username: string): Promise<{ isVerified: boolean }> {
    const [user] = await this.sql<{ is_verified: boolean }[]>`SELECT is_verified FROM identity.users WHERE username=${username}`;
    return { isVerified: user?.is_verified ?? false };
  }
}
