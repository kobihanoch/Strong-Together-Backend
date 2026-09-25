import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { AerobicsCache } from './application/ports/aerobics-cache.port';
import { AerobicsRepository } from './application/ports/aerobics.repository';
import { CreateAerobicEntryUseCase } from './application/commands/create-aerobic-entry.use-case';
import { DeleteAerobicEntryUseCase } from './application/commands/delete-aerobic-entry.use-case';
import { GetAerobicHistoryUseCase } from './application/queries/get-aerobic-history.use-case';
import { UpdateAerobicEntryUseCase } from './application/commands/update-aerobic-entry.use-case';
import { FindByUserSql } from './infrastructure/persistence/reads/find-by-user.sql';
import { CreateForUserSql } from './infrastructure/persistence/writes/create-for-user.sql';
import { DeleteForUserSql } from './infrastructure/persistence/writes/delete-for-user.sql';
import { UpdateForUserSql } from './infrastructure/persistence/writes/update-for-user.sql';
import { PostgresAerobicsRepository } from './infrastructure/persistence/postgres-aerobics.repository';
import { RedisAerobicsCache } from './infrastructure/redis-aerobics.cache';
import { AerobicsController } from './presentation/aerobics.controller';
import { AerobicsQueries } from './application/ports/aerobics.queries';
import { PostgresAerobicsQueries } from './infrastructure/persistence/postgres-aerobics.queries';

@Module({
  controllers: [AerobicsController],
  providers: [
    { provide: AerobicsQueries, useClass: PostgresAerobicsQueries },
    FindByUserSql,
    CreateForUserSql,
    DeleteForUserSql,
    UpdateForUserSql,
    {
      provide: AerobicsRepository,
      useClass: PostgresAerobicsRepository,
    },
    {
      provide: AerobicsCache,
      useClass: RedisAerobicsCache,
    },
    GetAerobicHistoryUseCase,
    CreateAerobicEntryUseCase,
    UpdateAerobicEntryUseCase,
    DeleteAerobicEntryUseCase,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class AerobicsModule {}
