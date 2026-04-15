import { Module } from '@nestjs/common';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { MessagesController } from './messages.controller.ts';
import { MessagesService } from './messages.service.ts';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
  exports: [MessagesService],
})
export class MessagesModule {}
