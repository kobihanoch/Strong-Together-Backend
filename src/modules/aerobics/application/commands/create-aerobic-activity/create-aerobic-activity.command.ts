import { Command, type ICommand } from '@nestjs/cqrs';
import type { AerobicEntryInput } from '../../models/aerobics.models';

export class CreateAerobicActivityCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly record: AerobicEntryInput,
  ) {
    super();
  }
}
