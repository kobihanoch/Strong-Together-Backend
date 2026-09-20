import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { CreateUserQueries } from './create.queries';
import type { CreateUserBody } from '@strong-together/shared';
import { VerificationEmailSender } from '../../auth/verification/application/ports/verification-email-sender.port';
import { DBService } from '../../../infrastructure/db/db.service';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly dbService: DBService,
    private readonly createUserQueries: CreateUserQueries,
    private readonly verificationEmailSender: VerificationEmailSender,
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
    const passwordHash = await bcrypt.hash(password, salt);

    const created = await this.createUserQueries.queryInsertUser(username!, fullName, email!, gender, passwordHash);

    this.dbService.afterCommit(() => {
      return this.verificationEmailSender.send(email as string, created.id, fullName, {
        ...(requestId ? { requestId } : {}),
      });
    });
  }
}
