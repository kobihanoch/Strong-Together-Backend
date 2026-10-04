import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { VerificationQueries } from '../../ports/verification.queries';
import { GetVerificationStatusQuery } from './get-verification-status.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Retrieves a username's public verification state. */
@QueryHandler(GetVerificationStatusQuery)
export class GetVerificationStatusHandler implements IQueryHandler<GetVerificationStatusQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: VerificationQueries,
  ) {}

  /**
   * Retrieves whether a username belongs to a verified account.
   *
   * @param username - The username whose status is requested.
   * @returns The public verification-state payload.
   */
  async execute(query: GetVerificationStatusQuery): Promise<{ isVerified: boolean }> {
    const { username } = query;
    return this.unitOfWork.executeReadOnly(undefined, async () => {
      return { isVerified: await this.query.getVerificationStatus(username) };
    });
  }
}
