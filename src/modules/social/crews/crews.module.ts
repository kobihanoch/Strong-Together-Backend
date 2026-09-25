import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { SupabaseModule } from '../../../infrastructure/capabilities/storage/supabase/supabase.module';
import { CrewImageStorage } from './application/ports/crew-image-storage.port';
import { CrewsRepository } from './application/ports/crews.repository';
import { CreateCrewUseCase } from './application/commands/create-crew.use-case';
import { DeleteCrewProfilePictureUseCase } from './application/commands/delete-crew-profile-picture.use-case';
import { DeleteCrewUseCase } from './application/commands/delete-crew.use-case';
import { GetCrewUseCase } from './application/queries/get-crew.use-case';
import { LeaveCrewUseCase } from './application/commands/leave-crew.use-case';
import { ListCrewParticipantsUseCase } from './application/queries/list-crew-participants.use-case';
import { ListCrewsUseCase } from './application/queries/list-crews.use-case';
import { ListMyCrewsUseCase } from './application/queries/list-my-crews.use-case';
import { ReplaceCrewProfilePictureUseCase } from './application/commands/replace-crew-profile-picture.use-case';
import { UpdateCrewUseCase } from './application/commands/update-crew.use-case';
import { FindByIdSql } from './infrastructure/persistence/reads/find-by-id.sql';
import { ListMineSql } from './infrastructure/persistence/reads/list-mine.sql';
import { ListParticipantsSql } from './infrastructure/persistence/reads/list-participants.sql';
import { ListSql } from './infrastructure/persistence/reads/list.sql';
import { CreateSql } from './infrastructure/persistence/writes/create.sql';
import { DeleteSql } from './infrastructure/persistence/writes/delete.sql';
import { FindProfilePictureForUpdateSql } from './infrastructure/persistence/reads/find-profile-picture-for-update.sql';
import { LeaveSql } from './infrastructure/persistence/writes/leave.sql';
import { UpdateProfilePictureSql } from './infrastructure/persistence/writes/update-profile-picture.sql';
import { UpdateSql } from './infrastructure/persistence/writes/update.sql';
import { PostgresCrewsRepository } from './infrastructure/persistence/postgres-crews.repository';
import { SupabaseCrewImageStorage } from './infrastructure/supabase-crew-image.storage';
import { CrewsController } from './presentation/crews.controller';
import { CrewsQueries } from './application/ports/crews.queries';
import { PostgresCrewsQueries } from './infrastructure/persistence/postgres-crews.queries';

@Module({
  imports: [SupabaseModule],
  controllers: [CrewsController],
  providers: [
    { provide: CrewsQueries, useClass: PostgresCrewsQueries },
    ListCrewsUseCase,
    ListMyCrewsUseCase,
    ListCrewParticipantsUseCase,
    GetCrewUseCase,
    CreateCrewUseCase,
    UpdateCrewUseCase,
    ReplaceCrewProfilePictureUseCase,
    DeleteCrewProfilePictureUseCase,
    LeaveCrewUseCase,
    DeleteCrewUseCase,
    FindByIdSql,

    ListMineSql,

    ListParticipantsSql,

    ListSql,

    CreateSql,

    DeleteSql,

    FindProfilePictureForUpdateSql,

    LeaveSql,

    UpdateProfilePictureSql,

    UpdateSql,
    { provide: CrewsRepository, useClass: PostgresCrewsRepository },
    { provide: CrewImageStorage, useClass: SupabaseCrewImageStorage },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class CrewsModule {}
