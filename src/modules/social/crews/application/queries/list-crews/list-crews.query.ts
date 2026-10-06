import { Query, type IQuery } from '@nestjs/cqrs';

import type { CrewsPage } from '../../models/crews.models';
export class ListCrewsQuery extends Query<CrewsPage> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly limit: number,
    public readonly cursor?: string,
    public readonly search?: string,
  ) {
    super();
  }
}
