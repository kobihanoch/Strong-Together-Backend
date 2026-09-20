import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { AuthCoreModule } from '../../auth/core/auth-core.module';
import { SessionModule } from '../../auth/session/session.module';
import { OAuthCoreModule } from '../core/oauth-core.module';
import { AppleIdentityVerifier } from './application/ports/apple-identity-verifier.port';
import { SignInWithAppleUseCase } from './application/use-cases/sign-in-with-apple.use-case';
import { JoseAppleIdentityVerifier } from './infrastructure/jose-apple-identity.verifier';
import { AppleController } from './presentation/apple.controller';

/** Composes Apple OAuth authentication. */
@Module({
  imports: [AuthCoreModule, SessionModule, OAuthCoreModule],
  controllers: [AppleController],
  providers: [{ provide: AppleIdentityVerifier, useClass: JoseAppleIdentityVerifier }, SignInWithAppleUseCase, RateLimitGuard],
})
export class AppleOAuthModule {}
