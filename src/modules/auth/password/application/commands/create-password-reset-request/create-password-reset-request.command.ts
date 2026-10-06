import { Command, type ICommand } from '@nestjs/cqrs';
export class CreatePasswordResetRequestCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly identifier: string,
    public readonly requestId?: string,
  ) {
    super();
  }
}
