import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PasswordHasher } from '../application/ports/password-hasher.port';

/** Shared bcrypt password-hashing adapter. */
@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  compare(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }

  async hash(plaintext: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plaintext, salt);
  }
}
