import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { AerobicsCache } from './application/ports/aerobics-cache.port';
import { AerobicsRepository } from './application/ports/aerobics.repository';
import { CreateAerobicEntryUseCase } from './application/use-cases/create-aerobic-entry.use-case';
import { DeleteAerobicEntryUseCase } from './application/use-cases/delete-aerobic-entry.use-case';
import { GetAerobicHistoryUseCase } from './application/use-cases/get-aerobic-history.use-case';
import { UpdateAerobicEntryUseCase } from './application/use-cases/update-aerobic-entry.use-case';
import { AerobicsSql } from './infrastructure/aerobics.sql';
import { PostgresAerobicsRepository } from './infrastructure/postgres-aerobics.repository';
import { RedisAerobicsCache } from './infrastructure/redis-aerobics.cache';
import { AerobicsController } from './presentation/aerobics.controller';

@Module({
  controllers: [AerobicsController],
  providers: [
    AerobicsSql,
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
