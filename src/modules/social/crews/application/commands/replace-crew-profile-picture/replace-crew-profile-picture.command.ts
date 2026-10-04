import { Command, type ICommand } from '@nestjs/cqrs';
import type { CrewImageUpload } from '../../models/crews.models';
import type { CrewProfilePictureResult } from '../../models/crews.models';

export class ReplaceCrewProfilePictureCommand extends Command<CrewProfilePictureResult> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly crewId: string,
    public readonly file: CrewImageUpload | undefined,
    public readonly onCleanupFailure: (error: unknown, oldPath: string) => void,
  ) {
    super();
  }
}
