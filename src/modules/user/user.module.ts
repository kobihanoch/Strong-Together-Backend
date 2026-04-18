import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { EmailsModule } from '../../infrastructure/queues/emails/emails.module';
import { AuthModule } from '../auth/auth.module';
import { CreateUserController } from './create/create.controller';
import { CreateUserQueries } from './create/create.queries';
import { CreateUserService } from './create/create.service';
import { PushTokensController } from './push-tokens/push-tokens.controller';
import { PushTokensQueries } from './push-tokens/push-tokens.queries';
import { PushTokensService } from './push-tokens/push-tokens.service';
import { UpdateEmailsService } from './update/update-emails/update-emails.service';
import { UpdateUserController } from './update/update.controller';
import { UpdateUserQueries } from './update/update.queries';
import { UpdateUserService } from './update/update.service';
import { SupabaseModule } from '../../infrastructure/supabase/supabase.module';

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
