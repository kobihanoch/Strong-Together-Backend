import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { EmailsModule } from '../../infrastructure/queues/emails/emails.module.ts';
import { AuthModule } from '../auth/auth.module.ts';
import { CreateUserController } from './create/create.controller.ts';
import { CreateUserQueries } from './create/create.queries.ts';
import { CreateUserService } from './create/create.service.ts';
import { PushTokensController } from './push-tokens/push-tokens.controller.ts';
import { PushTokensQueries } from './push-tokens/push-tokens.queries.ts';
import { PushTokensService } from './push-tokens/push-tokens.service.ts';
import { UpdateEmailsService } from './update/update-emails/update-emails.service.ts';
import { UpdateUserController } from './update/update.controller.ts';
import { UpdateUserQueries } from './update/update.queries.ts';
import { UpdateUserService } from './update/update.service.ts';
import { SupabaseModule } from '../../infrastructure/supabase/supabase.module.ts';

@Module({
  imports: [
    AuthGuardsModule,
    EmailsModule,
    AuthModule /* For verification mails */,
    SupabaseModule /* For profile pics updating */,
  ],
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
    UpdateEmailsService,
  ],
  exports: [UpdateUserService],
})
export class UserModule {}
