import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { VerificationRepository } from '../ports/verification.repository';

/** Retrieves a username's public verification state. */
@Injectable()
export class GetVerificationStatusUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly verification: VerificationRepository,
  ) {}

  /**
   * Retrieves whether a username belongs to a verified account.
   *
   * @param username - The username whose status is requested.
   * @returns The public verification-state payload.
   */
  async execute(username: string): Promise<{ isVerified: boolean }> {
    return this.unitOfWork.execute(undefined, async () => {
      return { isVerified: await this.verification.getVerificationStatus(username) };
    });
  }
}
