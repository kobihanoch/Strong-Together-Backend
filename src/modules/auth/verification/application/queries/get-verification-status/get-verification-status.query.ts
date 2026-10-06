import { Query, type IQuery } from '@nestjs/cqrs';
export class GetVerificationStatusQuery extends Query<{ isVerified: boolean }> implements IQuery {
  public constructor(
    public readonly username: string,
  ) {
    super();
  }
}
