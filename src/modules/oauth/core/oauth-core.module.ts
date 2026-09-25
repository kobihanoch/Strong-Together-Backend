import { Module } from '@nestjs/common';
import { OAuthRepository } from './application/ports/oauth.repository';
import { CreateUserSql } from './infrastructure/persistence/writes/create-user.sql';
import { FindLinkedUserSql } from './infrastructure/persistence/writes/find-linked-user.sql';
import { LinkByVerifiedEmailSql } from './infrastructure/persistence/writes/link-by-verified-email.sql';
import { PostgresOAuthRepository } from './infrastructure/persistence/postgres-oauth.repository';

/** Provides persistence shared by the Apple and Google OAuth capabilities. */
@Module({
  providers: [CreateUserSql, FindLinkedUserSql, LinkByVerifiedEmailSql, { provide: OAuthRepository, useClass: PostgresOAuthRepository }],
  exports: [OAuthRepository],
})
export class OAuthCoreModule {}
