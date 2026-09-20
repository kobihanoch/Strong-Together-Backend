import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { SupabaseModule } from '../../../infrastructure/supabase/supabase.module';
import { CrewImageStorage } from './application/ports/crew-image-storage.port';
import { CrewsRepository } from './application/ports/crews.repository';
import { CreateCrewUseCase } from './application/use-cases/create-crew.use-case';
import { DeleteCrewProfilePictureUseCase } from './application/use-cases/delete-crew-profile-picture.use-case';
import { DeleteCrewUseCase } from './application/use-cases/delete-crew.use-case';
import { GetCrewUseCase } from './application/use-cases/get-crew.use-case';
import { LeaveCrewUseCase } from './application/use-cases/leave-crew.use-case';
import { ListCrewParticipantsUseCase } from './application/use-cases/list-crew-participants.use-case';
import { ListCrewsUseCase } from './application/use-cases/list-crews.use-case';
import { ListMyCrewsUseCase } from './application/use-cases/list-my-crews.use-case';
import { ReplaceCrewProfilePictureUseCase } from './application/use-cases/replace-crew-profile-picture.use-case';
import { UpdateCrewUseCase } from './application/use-cases/update-crew.use-case';
import { CrewsSql } from './infrastructure/crews.sql';
import { PostgresCrewsRepository } from './infrastructure/postgres-crews.repository';
import { SupabaseCrewImageStorage } from './infrastructure/supabase-crew-image.storage';
import { CrewsController } from './presentation/crews.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [CrewsController],
  providers: [
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
    CrewsSql,
    { provide: CrewsRepository, useClass: PostgresCrewsRepository },
    { provide: CrewImageStorage, useClass: SupabaseCrewImageStorage },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class CrewsModule {}
