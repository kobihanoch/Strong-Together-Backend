import { Command, type ICommand } from '@nestjs/cqrs';
import type { CreateUserInput } from '../../models/create-user.models';

export class CreateUserCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly input: CreateUserInput,
    public readonly requestId?: string,
  ) {
    super();
  }
}
