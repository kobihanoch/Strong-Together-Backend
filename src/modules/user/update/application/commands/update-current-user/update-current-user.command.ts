import { Command, type ICommand } from '@nestjs/cqrs';
import type { UpdateUserInput } from '../../models/update-user.models';

export class UpdateCurrentUserCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly input: UpdateUserInput,
    public readonly requestId?: string,
  ) {
    super();
  }
}
