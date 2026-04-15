import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { MessagesModule } from '../messages/messages.module.ts';
import { AppleController } from './apple/apple.controller.ts';
import { AppleService } from './apple/apple.service.ts';
import { GoogleController } from './google/google.controller.ts';
import { GoogleService } from './google/google.service.ts';

@Module({
  imports: [MessagesModule],
  controllers: [AppleController, GoogleController],
  providers: [AppleService, GoogleService, RateLimitGuard, RlsTxInterceptor],
})
export class OAuthModule {}
