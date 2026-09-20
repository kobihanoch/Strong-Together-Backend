import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { EmailsModule } from '../../../infrastructure/queues/emails/emails.module';
import { SupabaseModule } from '../../../infrastructure/supabase/supabase.module';
import { EmailChangeTokens } from './application/ports/email-change-tokens.port';
import { ProfilePictureStorage } from './application/ports/profile-picture-storage.port';
import { UpdateEmailSender } from './application/ports/update-email-sender.port';
import { UserProfileRepository } from './application/ports/user-profile.repository';
import { ConfirmEmailChangeUseCase } from './application/use-cases/confirm-email-change.use-case';
import { DeleteProfilePictureUseCase } from './application/use-cases/delete-profile-picture.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case';
import { ReplaceProfilePictureUseCase } from './application/use-cases/replace-profile-picture.use-case';
import { UpdateCurrentUserUseCase } from './application/use-cases/update-current-user.use-case';
import { JwtEmailChangeTokens } from './infrastructure/jwt-email-change.tokens';
import { PostgresUserProfileRepository } from './infrastructure/postgres-user-profile.repository';
import { QueuedUpdateEmailSender } from './infrastructure/queued-update-email.sender';
import { SupabaseProfilePictureStorage } from './infrastructure/supabase-profile-picture.storage';
import { UpdateUserSql } from './infrastructure/update-user.sql';
import { UpdateUserController } from './presentation/update-user.controller';

/** Composes user profile management and its adapters. */
@Module({
  imports: [EmailsModule, SupabaseModule],
  controllers: [UpdateUserController],
  providers: [
    UpdateUserSql,
    { provide: UserProfileRepository, useClass: PostgresUserProfileRepository },
    { provide: UpdateEmailSender, useClass: QueuedUpdateEmailSender },
    { provide: ProfilePictureStorage, useClass: SupabaseProfilePictureStorage },
    { provide: EmailChangeTokens, useClass: JwtEmailChangeTokens },
    GetCurrentUserUseCase,
    UpdateCurrentUserUseCase,
    ConfirmEmailChangeUseCase,
    DeleteUserUseCase,
    ReplaceProfilePictureUseCase,
    DeleteProfilePictureUseCase,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    RateLimitGuard,
  ],
})
export class UpdateUserModule {}
