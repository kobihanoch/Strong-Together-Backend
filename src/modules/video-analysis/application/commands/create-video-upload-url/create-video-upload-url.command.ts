import { Command, type ICommand } from '@nestjs/cqrs';
import type { CreateVideoUploadInput } from '../../models/video-analysis.models';
import type { VideoUploadResult } from '../../models/video-analysis.models';

export class CreateVideoUploadUrlCommand extends Command<VideoUploadResult> implements ICommand {
  public constructor(
    public readonly input: CreateVideoUploadInput,
  ) {
    super();
  }
}
