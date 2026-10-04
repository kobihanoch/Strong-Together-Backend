import { Command, type ICommand } from '@nestjs/cqrs';
import type { AerobicEntryInput } from '../../models/aerobics.models';

export class UpdateAerobicActivityCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly id: number,
    public readonly record: AerobicEntryInput,
  ) {
    super();
  }
}
