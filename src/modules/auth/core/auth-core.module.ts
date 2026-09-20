import { Module } from '@nestjs/common';
import { AuthPolicy } from './application/ports/auth-policy.port';
import { AuthTokens } from './application/ports/auth-tokens.port';
import { AuthenticationTransaction } from './application/ports/authentication-transaction.port';
import { OneTimeTokenStore } from './application/ports/one-time-token-store.port';
import { PasswordHasher } from './application/ports/password-hasher.port';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password-hasher';
import { ConfiguredAuthPolicy } from './infrastructure/configured-auth-policy';
import { DbAuthenticationTransaction } from './infrastructure/db-authentication-transaction';
import { JwtAuthTokens } from './infrastructure/jwt-auth-tokens';
import { RedisOneTimeTokenStore } from './infrastructure/redis-one-time-token.store';

const authCorePorts = [AuthPolicy, AuthTokens, AuthenticationTransaction, OneTimeTokenStore, PasswordHasher];

@Module({
  providers: [
    { provide: AuthPolicy, useClass: ConfiguredAuthPolicy },
    { provide: AuthTokens, useClass: JwtAuthTokens },
    { provide: AuthenticationTransaction, useClass: DbAuthenticationTransaction },
    { provide: OneTimeTokenStore, useClass: RedisOneTimeTokenStore },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
  ],
  exports: authCorePorts,
})
export class AuthCoreModule {}
