import { Command, type ICommand } from '@nestjs/cqrs';
import type { ProfilePictureFile } from '../../models/update-user.models';
import type { ProfilePictureResult } from '../../models/update-user.models';

export class ReplaceProfilePictureCommand extends Command<ProfilePictureResult> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly file: ProfilePictureFile | undefined,
  ) {
    super();
  }
}
