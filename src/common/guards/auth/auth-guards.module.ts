import { Module } from '@nestjs/common';
import { SessionQueries } from '../../../modules/auth/session/session.queries';
import { AuthenticationGuard } from './authentication.guard';
import { AuthorizationGuard } from './authorization.guard';

@Module({
  providers: [SessionQueries, AuthenticationGuard, AuthorizationGuard],
  exports: [SessionQueries, AuthenticationGuard, AuthorizationGuard],
})
export class AuthGuardsModule {}
