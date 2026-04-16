import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { from, lastValueFrom, Observable } from 'rxjs';
import { DBService } from '../../infrastructure/db/db.service.ts';

@Injectable()
export class RlsTxInterceptor implements NestInterceptor {
  constructor(private readonly dbService: DBService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{ user?: { id?: string } }>();

    return from(
      this.dbService.runWithRlsTx(req.user?.id, async () => {
        return lastValueFrom(next.handle());
      }),
    );
  }
}
