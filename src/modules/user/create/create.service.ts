import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { CreateUserQueries } from './create.queries';
import type { CreateUserBody } from '@strong-together/shared';
import { VerificationEmailsService } from '../../auth/verification/verification-emails/verification-emails.service';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly createUserQueries: CreateUserQueries,
    private readonly verificationEmailsService: VerificationEmailsService,
  ) {}

  /**
   * Creates a local user and sends the initial verification email.
   * @param body - The validated request body.
   * @param requestId - The request correlation identifier.
   */
  async createUserData(body: CreateUserBody, requestId?: string): Promise<void> {
    const { username, fullName, email, password, gender } = body;
    const rowsExists = await this.createUserQueries.queryUserExistsByUsernameOrEmail(username, email);
    const [user] = rowsExists;
    if (user) throw new BadRequestException('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const created = await this.createUserQueries.queryInsertUser(username!, fullName, email!, gender, hash);

    await this.verificationEmailsService.sendVerificationEmail(email as string, created.id, fullName, {
      ...(requestId ? { requestId } : {}),
    });
  }
}
