import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { CreateUserController } from './create/create.controller.ts';
import { CreateUserService } from './create/create.service.ts';
import { PushTokensController } from './push-tokens/push-tokens.controller.ts';
import { PushTokensService } from './push-tokens/push-tokens.service.ts';
import { UpdateUserController } from './update/update.controller.ts';
import { UpdateUserService } from './update/update.service.ts';

@Module({
  controllers: [CreateUserController, PushTokensController, UpdateUserController],
  providers: [
    CreateUserService,
    PushTokensService,
    UpdateUserService,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    RateLimitGuard,
    RlsTxInterceptor,
  ],
  exports: [UpdateUserService],
})
export class UserModule {}
