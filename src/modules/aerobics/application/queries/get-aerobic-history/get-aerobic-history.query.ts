import { Query, type IQuery } from '@nestjs/cqrs';

import type { AerobicsHistory } from '../../models/aerobics.models';
export class GetAerobicHistoryQuery extends Query<{ payload: AerobicsHistory; cacheHit: boolean }> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly days: number = 45,
    public readonly fromCache: boolean = true,
    public readonly timezone: string = 'Asia/Jerusalem',
  ) {
    super();
  }
}
