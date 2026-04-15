import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { queryInsertUser, queryUserExistsByUsernameOrEmail } from './create.queries.ts';
import { sendVerificationEmail } from '../../auth/verification/verification-emails/verification-emails.service.ts';
import type { CreateUserBody, CreateUserResponse } from '@strong-together/shared';

@Injectable()
export class CreateUserService {
  async createUserData(body: CreateUserBody, requestId?: string): Promise<CreateUserResponse> {
    const { username, fullName, email, password, gender } = body;
    const rowsExists = await queryUserExistsByUsernameOrEmail(username, email);
    const [user] = rowsExists;
    if (user) throw new BadRequestException('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const created = await queryInsertUser(username!, fullName, email!, gender, hash);

    await sendVerificationEmail(email as string, created.id, fullName, {
      ...(requestId ? { requestId } : {}),
    });

    return { message: 'User created successfully!', user: created };
  }
}
