import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { MessagesModule } from '../messages/messages.module.ts';
import { AppleController } from './apple/apple.controller.ts';
import { AppleQueries } from './apple/apple.queries.ts';
import { AppleService } from './apple/apple.service.ts';
import { GoogleController } from './google/google.controller.ts';
import { GoogleQueries } from './google/google.queries.ts';
import { GoogleService } from './google/google.service.ts';
import { SessionQueries } from '../auth/session/session.queries.ts';

@Module({
  imports: [MessagesModule],
  controllers: [AppleController, GoogleController],
  providers: [AppleQueries, AppleService, GoogleQueries, GoogleService, SessionQueries, RateLimitGuard, RlsTxInterceptor],
})
export class OAuthModule {}
