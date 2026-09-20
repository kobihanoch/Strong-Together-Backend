import { Module } from '@nestjs/common';
import { AppleOAuthModule } from './apple/apple.module';
import { GoogleOAuthModule } from './google/google.module';

@Module({
  imports: [AppleOAuthModule, GoogleOAuthModule],
  exports: [AppleOAuthModule, GoogleOAuthModule],
})
/** Composes the independent OAuth provider capabilities. */
export class OAuthModule {}
