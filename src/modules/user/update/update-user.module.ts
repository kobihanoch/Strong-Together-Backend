import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { EmailsModule } from '../../../infrastructure/capabilities/queues/emails/emails.module';
import { SupabaseModule } from '../../../infrastructure/capabilities/storage/supabase/supabase.module';
import { EmailChangeTokens } from './application/ports/email-change-tokens.port';
import { ProfilePictureStorage } from './application/ports/profile-picture-storage.port';
import { UpdateEmailSender } from './application/ports/update-email-sender.port';
import { UserProfileRepository } from './application/ports/user-profile.repository';
import { ConfirmEmailChangeUseCase } from './application/commands/confirm-email-change.use-case';
import { DeleteProfilePictureUseCase } from './application/commands/delete-profile-picture.use-case';
import { DeleteUserUseCase } from './application/commands/delete-user.use-case';
import { GetCurrentUserUseCase } from './application/queries/get-current-user.use-case';
import { ReplaceProfilePictureUseCase } from './application/commands/replace-profile-picture.use-case';
import { UpdateCurrentUserUseCase } from './application/commands/update-current-user.use-case';
import { JwtEmailChangeTokens } from './infrastructure/jwt-email-change.tokens';
import { PostgresUserProfileRepository } from './infrastructure/persistence/postgres-user-profile.repository';
import { QueuedUpdateEmailSender } from './infrastructure/queued-update-email.sender';
import { SupabaseProfilePictureStorage } from './infrastructure/supabase-profile-picture.storage';
import { FindSql } from './infrastructure/persistence/reads/find.sql';
import { DeleteSql } from './infrastructure/persistence/writes/delete.sql';
import { FindProfilePictureSql } from './infrastructure/persistence/reads/find-profile-picture.sql';
import { UpdateEmailSql } from './infrastructure/persistence/writes/update-email.sql';
import { UpdateProfilePictureSql } from './infrastructure/persistence/writes/update-profile-picture.sql';
import { UpdateSql } from './infrastructure/persistence/writes/update.sql';
import { UpdateUserController } from './presentation/update-user.controller';
import { UserProfileQueries } from './application/ports/user-profile.queries';
import { PostgresUserProfileQueries } from './infrastructure/persistence/postgres-user-profile.queries';

/** Composes user profile management and its adapters. */
@Module({
  imports: [EmailsModule, SupabaseModule],
  controllers: [UpdateUserController],
  providers: [
    { provide: UserProfileQueries, useClass: PostgresUserProfileQueries },
    FindSql,
    DeleteSql,
    FindProfilePictureSql,
    UpdateEmailSql,
    UpdateProfilePictureSql,
    UpdateSql,
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
