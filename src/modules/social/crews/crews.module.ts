import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { SupabaseModule } from '../../../infrastructure/capabilities/storage/supabase/supabase.module';
import { CrewImageStorage } from './application/ports/crew-image-storage.port';
import { CrewsRepository } from './application/ports/crews.repository';
import { CreateCrewHandler } from './application/commands/create-crew/create-crew.handler';
import { DeleteCrewProfilePictureHandler } from './application/commands/delete-crew-profile-picture/delete-crew-profile-picture.handler';
import { DeleteCrewHandler } from './application/commands/delete-crew/delete-crew.handler';
import { GetCrewHandler } from './application/queries/get-crew/get-crew.handler';
import { LeaveCrewHandler } from './application/commands/leave-crew/leave-crew.handler';
import { ListCrewParticipantsHandler } from './application/queries/list-crew-participants/list-crew-participants.handler';
import { ListCrewsHandler } from './application/queries/list-crews/list-crews.handler';
import { ListMyCrewsHandler } from './application/queries/list-my-crews/list-my-crews.handler';
import { ReplaceCrewProfilePictureHandler } from './application/commands/replace-crew-profile-picture/replace-crew-profile-picture.handler';
import { UpdateCrewHandler } from './application/commands/update-crew/update-crew.handler';
import { FindByIdSql } from './infrastructure/persistence/reads/find-by-id.sql';
import { ListMineSql } from './infrastructure/persistence/reads/list-mine.sql';
import { ListParticipantsSql } from './infrastructure/persistence/reads/list-participants.sql';
import { ListSql } from './infrastructure/persistence/reads/list.sql';
import { CreateSql } from './infrastructure/persistence/writes/create.sql';
import { DeleteSql } from './infrastructure/persistence/writes/delete.sql';
import { FindProfilePictureForUpdateSql } from './infrastructure/persistence/reads/find-profile-picture-for-update.sql';
import { SaveSql } from './infrastructure/persistence/writes/save.sql';
import { SaveParticipantsSql } from './infrastructure/persistence/writes/save-participants.sql';
import { FindCrewByIdForUpdateSql } from './infrastructure/persistence/reads/find-by-id-for-update.sql';
import { FindActiveParticipantsForUpdateSql } from './infrastructure/persistence/reads/find-active-participants-for-update.sql';
import { UpdateProfilePictureSql } from './infrastructure/persistence/writes/update-profile-picture.sql';
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
    ListCrewsHandler,
    ListMyCrewsHandler,
    ListCrewParticipantsHandler,
    GetCrewHandler,
    CreateCrewHandler,
    UpdateCrewHandler,
    ReplaceCrewProfilePictureHandler,
    DeleteCrewProfilePictureHandler,
    LeaveCrewHandler,
    DeleteCrewHandler,
    FindByIdSql,

    ListMineSql,

    ListParticipantsSql,

    ListSql,

    CreateSql,

    DeleteSql,

    FindProfilePictureForUpdateSql,

    FindCrewByIdForUpdateSql,
    FindActiveParticipantsForUpdateSql,
    SaveSql,
    SaveParticipantsSql,

    UpdateProfilePictureSql,

    { provide: CrewsRepository, useClass: PostgresCrewsRepository },
    { provide: CrewImageStorage, useClass: SupabaseCrewImageStorage },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class CrewsModule {}
