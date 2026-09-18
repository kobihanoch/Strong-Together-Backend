import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { AerobicsController } from './aerobics.controller';
import { AerobicsQueries } from './aerobics.queries';
import { AerobicsService } from './aerobics.service';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';

@Module({
  controllers: [AerobicsController],
  providers: [AerobicsQueries, AerobicsService, DpopGuard, AuthenticationGuard, AuthorizationGuard],
  exports: [AerobicsService],
})
export class AerobicsModule {}
