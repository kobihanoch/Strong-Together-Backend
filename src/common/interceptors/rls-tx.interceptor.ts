import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { from, lastValueFrom, Observable } from 'rxjs';
import { runWithRlsTx } from '../../infrastructure/db.client.ts';

@Injectable()
export class RlsTxInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{ user?: { id?: string } }>();

    return from(
      runWithRlsTx(req.user?.id, async () => {
        return lastValueFrom(next.handle());
      }),
    );
  }
}
