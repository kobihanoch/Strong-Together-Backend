import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { CreateUserController } from './create/create.controller.ts';
import { CreateUserQueries } from './create/create.queries.ts';
import { CreateUserService } from './create/create.service.ts';
import { PushTokensController } from './push-tokens/push-tokens.controller.ts';
import { PushTokensQueries } from './push-tokens/push-tokens.queries.ts';
import { PushTokensService } from './push-tokens/push-tokens.service.ts';
import { UpdateUserController } from './update/update.controller.ts';
import { UpdateUserQueries } from './update/update.queries.ts';
import { UpdateUserService } from './update/update.service.ts';

@Module({
  imports: [AuthGuardsModule],
  controllers: [CreateUserController, PushTokensController, UpdateUserController],
  providers: [
    CreateUserQueries,
    CreateUserService,
    PushTokensQueries,
    PushTokensService,
    UpdateUserQueries,
    UpdateUserService,
    DpopGuard,
    RateLimitGuard,
    RlsTxInterceptor,
  ],
  exports: [UpdateUserService],
})
export class UserModule {}
