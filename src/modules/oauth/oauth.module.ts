import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { MessagesModule } from '../messages/messages.module';
import { AppleController } from './apple/apple.controller';
import { AppleQueries } from './apple/apple.queries';
import { AppleService } from './apple/apple.service';
import { GoogleController } from './google/google.controller';
import { GoogleQueries } from './google/google.queries';
import { GoogleService } from './google/google.service';
import { SessionQueries } from '../auth/session/session.queries';

@Module({
  imports: [MessagesModule],
  controllers: [AppleController, GoogleController],
  providers: [AppleQueries, AppleService, GoogleQueries, GoogleService, SessionQueries, RateLimitGuard, RlsTxInterceptor],
})
export class OAuthModule {}
