import { Module } from '@nestjs/common';
import { PasswordModule } from './password/password.module';
import { SessionModule } from './session/session.module';
import { VerificationModule } from './verification/verification.module';

/** Composes the independent authentication submodules. */
@Module({
  imports: [SessionModule, PasswordModule, VerificationModule],
  exports: [SessionModule, VerificationModule],
})
export class AuthModule {}
