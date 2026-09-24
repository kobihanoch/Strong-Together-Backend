import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import { PushRepository } from '../ports/push.repository';

/** Rechecks whether a delayed workout notification is still eligible for delivery. */
@Injectable()
export class FindEligiblePushTokenUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: PushRepository,
  ) {}

  /** Retrieves an eligible token inside the target user's RLS transaction. */
  execute(userId: string, workoutScheduleId: string, occurrenceDate: string): Promise<string | null> {
    return this.unitOfWork.execute(userId, () => this.repository.findEligibleExpoPushToken(userId, workoutScheduleId, occurrenceDate));
  }
}
