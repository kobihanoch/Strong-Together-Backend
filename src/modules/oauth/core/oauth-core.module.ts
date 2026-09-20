import { Module } from '@nestjs/common';
import { OAuthRepository } from './application/ports/oauth.repository';
import { OAuthSql } from './infrastructure/oauth.sql';
import { PostgresOAuthRepository } from './infrastructure/postgres-oauth.repository';

/** Provides persistence shared by the Apple and Google OAuth capabilities. */
@Module({
  providers: [OAuthSql, { provide: OAuthRepository, useClass: PostgresOAuthRepository }],
  exports: [OAuthRepository],
})
export class OAuthCoreModule {}
