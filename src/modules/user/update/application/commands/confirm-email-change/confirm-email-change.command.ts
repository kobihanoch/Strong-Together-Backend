import { Command, type ICommand } from '@nestjs/cqrs';

import type { EmailChangeOutcome } from '../../models/update-user.models';
export class ConfirmEmailChangeCommand extends Command<EmailChangeOutcome> implements ICommand {
  public constructor(
    public readonly token: string | undefined,
  ) {
    super();
  }
}
