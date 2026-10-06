import { Command, type ICommand } from '@nestjs/cqrs';

import type { PushBatchResult } from '../../models/push.models';
export class EnqueueDueWorkoutRemindersCommand extends Command<PushBatchResult> implements ICommand {
  public constructor(
    public readonly requestId?: string,
  ) {
    super();
  }
}
