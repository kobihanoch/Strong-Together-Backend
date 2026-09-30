import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { CrewRequestsRepository } from './application/ports/crew-requests.repository';
import { InviteCrewUserHandler } from './application/commands/invite-crew-user/invite-crew-user.handler';
import { ListCrewInvitationsHandler } from './application/queries/list-crew-invitations/list-crew-invitations.handler';
import { ListPendingCrewJoinRequestsHandler } from './application/queries/list-pending-crew-join-requests/list-pending-crew-join-requests.handler';
import { RequestToJoinCrewHandler } from './application/commands/request-to-join-crew/request-to-join-crew.handler';
import { UpdateCrewParticipationRequestHandler } from './application/commands/update-crew-participation-request/update-crew-participation-request.handler';
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
    InviteCrewUserHandler,
    RequestToJoinCrewHandler,
    ListCrewInvitationsHandler,
    ListPendingCrewJoinRequestsHandler,
    UpdateCrewParticipationRequestHandler,
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
