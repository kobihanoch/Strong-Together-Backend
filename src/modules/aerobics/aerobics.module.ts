import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { AerobicsCache } from './application/ports/aerobics-cache.port';
import { AerobicsRepository } from './application/ports/aerobics.repository';
import { CreateAerobicActivityHandler } from './application/commands/create-aerobic-activity/create-aerobic-activity.handler';
import { DeleteAerobicActivityHandler } from './application/commands/delete-aerobic-activity/delete-aerobic-activity.handler';
import { GetAerobicHistoryHandler } from './application/queries/get-aerobic-history/get-aerobic-history.handler';
import { UpdateAerobicActivityHandler } from './application/commands/update-aerobic-activity/update-aerobic-activity.handler';
import { FindByUserSql } from './infrastructure/persistence/reads/find-by-user.sql';
import { CreateSql } from './infrastructure/persistence/writes/create.sql';
import { DeleteSql } from './infrastructure/persistence/writes/delete.sql';
import { SaveSql } from './infrastructure/persistence/writes/save.sql';
import { FindByIdForUpdateSql } from './infrastructure/persistence/reads/find-by-id-for-update.sql';
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
    CreateSql,
    FindByIdForUpdateSql,
    DeleteSql,
    SaveSql,
    {
      provide: AerobicsRepository,
      useClass: PostgresAerobicsRepository,
    },
    {
      provide: AerobicsCache,
      useClass: RedisAerobicsCache,
    },
    GetAerobicHistoryHandler,
    CreateAerobicActivityHandler,
    UpdateAerobicActivityHandler,
    DeleteAerobicActivityHandler,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class AerobicsModule {}
