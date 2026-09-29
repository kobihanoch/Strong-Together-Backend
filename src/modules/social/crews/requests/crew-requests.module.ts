import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { CrewRequestsRepository } from './application/ports/crew-requests.repository';
import { InviteCrewUserUseCase } from './application/commands/invite-crew-user.use-case';
import { ListCrewInvitationsUseCase } from './application/queries/list-crew-invitations.use-case';
import { ListPendingCrewJoinRequestsUseCase } from './application/queries/list-pending-crew-join-requests.use-case';
import { RequestToJoinCrewUseCase } from './application/commands/request-to-join-crew.use-case';
import { UpdateCrewParticipationRequestUseCase } from './application/commands/update-crew-participation-request.use-case';
import { IsCrewLeaderSql } from './infrastructure/persistence/reads/is-crew-leader.sql';
import { ListInvitationsSql } from './infrastructure/persistence/reads/list-invitations.sql';
import { ListPendingJoinRequestsSql } from './infrastructure/persistence/reads/list-pending-join-requests.sql';
import { CreateParticipationRequestSql } from './infrastructure/persistence/writes/create.sql';
import { SaveSql } from './infrastructure/persistence/writes/save.sql';
import { FindParticipationRequestByIdForUpdateSql } from './infrastructure/persistence/reads/find-by-id-for-update.sql';
import { FindCrewPrivacySql } from './infrastructure/persistence/reads/find-crew-privacy.sql';
import { PostgresCrewRequestsRepository } from './infrastructure/persistence/postgres-crew-requests.repository';
import { CrewRequestsController } from './presentation/crew-requests.controller';
import { CrewRequestsQueries } from './application/ports/crew-requests.queries';
import { PostgresCrewRequestsQueries } from './infrastructure/persistence/postgres-crew-requests.queries';

@Module({
  controllers: [CrewRequestsController],
  providers: [
    { provide: CrewRequestsQueries, useClass: PostgresCrewRequestsQueries },
    InviteCrewUserUseCase,
    RequestToJoinCrewUseCase,
    ListCrewInvitationsUseCase,
    ListPendingCrewJoinRequestsUseCase,
    UpdateCrewParticipationRequestUseCase,
    IsCrewLeaderSql,
    ListInvitationsSql,
    ListPendingJoinRequestsSql,
    CreateParticipationRequestSql,
    FindParticipationRequestByIdForUpdateSql,
    FindCrewPrivacySql,
    SaveSql,
    { provide: CrewRequestsRepository, useClass: PostgresCrewRequestsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class CrewRequestsModule {}
