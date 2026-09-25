import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { OperationLogger } from '../../common/application/ports/operation-logger.port';
import type { AppRequest } from '../../common/types/express';
import { createLogger } from '../capabilities/observability/logger';

const fallbackLogger = createLogger('application');

/** Writes application events through the logger correlated to the current HTTP request. */
@Injectable({ scope: Scope.REQUEST })
export class RequestOperationLogger implements OperationLogger {
  constructor(@Inject(REQUEST) private readonly request: AppRequest) {}

  info(context: object, message: string): void {
    (this.request.logger ?? fallbackLogger).info(context, message);
  }

  warn(context: object, message: string): void {
    (this.request.logger ?? fallbackLogger).warn(context, message);
  }

  error(context: object, message: string): void {
    (this.request.logger ?? fallbackLogger).error(context, message);
  }
}
