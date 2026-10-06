import { Command, type ICommand } from '@nestjs/cqrs';
export class CreateVerificationEmailCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly email: string,
    public readonly requestId?: string,
  ) {
    super();
  }
}
