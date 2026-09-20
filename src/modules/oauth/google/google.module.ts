import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { AuthCoreModule } from '../../auth/core/auth-core.module';
import { SessionModule } from '../../auth/session/session.module';
import { OAuthCoreModule } from '../core/oauth-core.module';
import { GoogleIdentityVerifier } from './application/ports/google-identity-verifier.port';
import { SignInWithGoogleUseCase } from './application/use-cases/sign-in-with-google.use-case';
import { JoseGoogleIdentityVerifier } from './infrastructure/jose-google-identity.verifier';
import { GoogleController } from './presentation/google.controller';

/** Composes Google OAuth authentication. */
@Module({
  imports: [AuthCoreModule, SessionModule, OAuthCoreModule],
  controllers: [GoogleController],
  providers: [{ provide: GoogleIdentityVerifier, useClass: JoseGoogleIdentityVerifier }, SignInWithGoogleUseCase, RateLimitGuard],
})
export class GoogleOAuthModule {}
