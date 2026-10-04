import { Command, type ICommand } from '@nestjs/cqrs';
export class ResetPasswordCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly token: string | undefined,
    public readonly newPassword: string,
  ) {
    super();
  }
}
