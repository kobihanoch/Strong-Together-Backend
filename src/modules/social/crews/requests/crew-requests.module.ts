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
import { CreateMembershipSql } from './infrastructure/persistence/writes/create-membership.sql';
import { InviteUserSql } from './infrastructure/persistence/writes/invite-user.sql';
import { RequestToJoinSql } from './infrastructure/persistence/writes/request-to-join.sql';
import { UpdateStatusSql } from './infrastructure/persistence/writes/update-status.sql';
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
    CreateMembershipSql,
    InviteUserSql,
    RequestToJoinSql,
    UpdateStatusSql,
    { provide: CrewRequestsRepository, useClass: PostgresCrewRequestsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class CrewRequestsModule {}
