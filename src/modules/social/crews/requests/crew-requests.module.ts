import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { CrewRequestsRepository } from './application/ports/crew-requests.repository';
import { InviteCrewUserUseCase } from './application/use-cases/invite-crew-user.use-case';
import { ListCrewInvitationsUseCase } from './application/use-cases/list-crew-invitations.use-case';
import { ListPendingCrewJoinRequestsUseCase } from './application/use-cases/list-pending-crew-join-requests.use-case';
import { RequestToJoinCrewUseCase } from './application/use-cases/request-to-join-crew.use-case';
import { UpdateCrewParticipationRequestUseCase } from './application/use-cases/update-crew-participation-request.use-case';
import { CrewRequestsSql } from './infrastructure/crew-requests.sql';
import { PostgresCrewRequestsRepository } from './infrastructure/postgres-crew-requests.repository';
import { CrewRequestsController } from './presentation/crew-requests.controller';

@Module({
  controllers: [CrewRequestsController],
  providers: [
    InviteCrewUserUseCase,
    RequestToJoinCrewUseCase,
    ListCrewInvitationsUseCase,
    ListPendingCrewJoinRequestsUseCase,
    UpdateCrewParticipationRequestUseCase,
    CrewRequestsSql,
    { provide: CrewRequestsRepository, useClass: PostgresCrewRequestsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class CrewRequestsModule {}
