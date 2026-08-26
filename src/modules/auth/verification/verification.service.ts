import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';
import { VerificationQueries } from './verification.queries';
import { CreateUserQueries } from '../../user/create/create.queries';
import { VerificationEmailsService } from './verification-emails/verification-emails.service';
import { generateVerificationFailedHTML, generateVerifiedHTML } from './verification.views';
import type { ChangeEmailAndVerifyBody, SendVerificationMailBody } from '@strong-together/shared';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import { DBService } from '../../../infrastructure/db/db.service';
import { decodeVerifyToken } from './verification.utils';

@Injectable()
export class VerificationService {
  constructor(
    @Inject(SQL) private readonly sql: postgres.Sql,
    private readonly dbService: DBService,
    private readonly verificationQueries: VerificationQueries,
    private readonly createUserQueries: CreateUserQueries,
    private readonly verificationEmailsService: VerificationEmailsService,
    private readonly cacheSerice: CacheService,
  ) {}

  /**
   * Verifies user account.
   * @param token - The token to process.
   * @returns The verify user account result.
   */
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

    await this.dbService.promoteCurrentRlsTxToAuthenticated(sub);
    await this.verificationQueries.queryUpdateUserVerificationStatus(sub, true);
    return { statusCode: 200, html: generateVerifiedHTML() };
  }

  /**
   * Sends verification mail.
   * @param body - The validated request body.
   * @param requestId - The request correlation identifier.
   */
  async sendVerificationMailData(body: SendVerificationMailBody, requestId?: string): Promise<void> {
    const { email } = body;
    const [row] = await this.sql<{ userData: { id: string; name: string | null; username: string } | null }[]>`
      SELECT guest_api.find_user_for_email(${email}) AS "userData"
    `;
    const user = row?.userData ?? null;
    if (!user) return;
    const { id, name } = user;
    await this.verificationEmailsService.sendVerificationEmail(email, id, name ?? user.username, {
      ...(requestId ? { requestId } : {}),
    });
  }

  /**
   * Change email and verify.
   * @param body - The validated request body.
   * @param requestId - The request correlation identifier.
   */
  async changeEmailAndVerifyData(body: ChangeEmailAndVerifyBody, requestId?: string): Promise<void> {
    const { username, password, newEmail } = body;

    const [user = null] = await this.verificationQueries.queryUserByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash!);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (user.isVerified) throw new BadRequestException('Account already verified');

    const [exists] = await this.createUserQueries.queryUserExistsByUsernameOrEmail(null, newEmail);
    if (exists) throw new ConflictException('Email already in use');

    await this.dbService.promoteCurrentRlsTxToAuthenticated(user.id);
    await this.sql`UPDATE identity.user SET email = ${newEmail} WHERE id = ${user.id}::uuid`;
    await this.verificationEmailsService.sendVerificationEmail(
      newEmail,
      user.id,
      user.name ? user.name : user.username!,
      {
        ...(requestId ? { requestId } : {}),
      },
    );
  }

  /**
   * Checks user verify.
   * @param username - The username.
   * @returns The check user verify result.
   */
  async checkUserVerifyData(username: string): Promise<{ isVerified: boolean }> {
    const [user] = await this.sql<{ is_verified: boolean | null }[]>`
      SELECT guest_api.verification_state(${username}) AS is_verified
    `;
    return { isVerified: user?.is_verified ?? false };
  }
}
