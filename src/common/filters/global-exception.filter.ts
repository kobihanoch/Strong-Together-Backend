import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { createLogger } from '../../infrastructure/logger.ts';
import type { AppRequest } from '../types/express.ts';

const logger = createLogger('filter:error-handler');

@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<AppRequest>();
    const res = ctx.getResponse<Response>();

    const requestLogger = req.logger || logger;

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : this.getStatusCodeFromUnknownError(exception) || HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? this.getMessageFromHttpException(exception)
        : this.getMessageFromUnknownError(exception) || 'Internal Server Error';

    requestLogger.error(
      {
        err: exception,
        event: 'request.failed',
        statusCode,
        method: req.method,
        path: req.originalUrl,
        userId: req.user?.id,
      },
      message,
    );

    res.status(statusCode).json({
      success: false,
      message,
    });
  }

  private getStatusCodeFromUnknownError(exception: unknown): number | undefined {
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'statusCode' in exception &&
      typeof (exception as { statusCode?: unknown }).statusCode === 'number'
    ) {
      return (exception as { statusCode: number }).statusCode;
    }

    return undefined;
  }

  private getMessageFromUnknownError(exception: unknown): string | undefined {
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'message' in exception &&
      typeof (exception as { message?: unknown }).message === 'string'
    ) {
      return (exception as { message: string }).message;
    }

    return undefined;
  }

  private getMessageFromHttpException(exception: HttpException): string {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null && 'message' in response) {
      const message = (response as { message?: unknown }).message;

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message) && message.length > 0) {
        return String(message[0]);
      }
    }

    return exception.message || 'Internal Server Error';
  }
}
