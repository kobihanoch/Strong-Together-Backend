import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { MessagesModule } from '../messages/messages.module';
import { AuthModule } from '../auth/auth.module';
import { AppleController } from './apple/apple.controller';
import { AppleQueries } from './apple/apple.queries';
import { AppleService } from './apple/apple.service';
import { GoogleController } from './google/google.controller';
import { GoogleQueries } from './google/google.queries';
import { GoogleService } from './google/google.service';

@Module({
  imports: [MessagesModule, AuthModule],
  controllers: [AppleController, GoogleController],
  providers: [AppleQueries, AppleService, GoogleQueries, GoogleService, RateLimitGuard],
})
export class OAuthModule {}
