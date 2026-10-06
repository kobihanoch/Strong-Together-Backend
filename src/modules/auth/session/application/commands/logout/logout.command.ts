import { Command, type ICommand } from '@nestjs/cqrs';
export class LogoutCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly refreshToken: string | null | undefined,
    public readonly dpopJkt?: string,
  ) {
    super();
  }
}
