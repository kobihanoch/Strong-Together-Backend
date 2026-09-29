import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PasswordHasher } from '../application/ports/password-hasher.port';
/** Bcrypt registration-password hasher. */
@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  }
}
