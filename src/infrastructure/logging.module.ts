import { Global, Module } from '@nestjs/common';
import { OperationLogger } from '../common/application/ports/operation-logger.port';
import { RequestOperationLogger } from './request-operation.logger';

/** Provides request-correlated operational logging throughout the application. */
@Global()
@Module({
  providers: [{ provide: OperationLogger, useClass: RequestOperationLogger }],
  exports: [OperationLogger],
})
export class LoggingModule {}
