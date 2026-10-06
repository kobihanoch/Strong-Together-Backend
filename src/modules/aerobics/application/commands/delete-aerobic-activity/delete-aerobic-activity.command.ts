import { Command, type ICommand } from '@nestjs/cqrs';
export class DeleteAerobicActivityCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly id: number,
  ) {
    super();
  }
}
