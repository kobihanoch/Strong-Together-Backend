import { Module } from '@nestjs/common';
import { SessionQueries } from '../../../modules/auth/session/session.queries.ts';
import { AuthenticationGuard } from './authentication.guard.ts';
import { AuthorizationGuard } from './authorization.guard.ts';

@Module({
  providers: [SessionQueries, AuthenticationGuard, AuthorizationGuard],
  exports: [AuthenticationGuard, AuthorizationGuard],
})
export class AuthGuardsModule {}
