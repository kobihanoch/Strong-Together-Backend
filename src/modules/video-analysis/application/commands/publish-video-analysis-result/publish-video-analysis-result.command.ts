import { Command, type ICommand } from '@nestjs/cqrs';
import type { VideoAnalysisResult } from '../../models/video-analysis.models';

export class PublishVideoAnalysisResultCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly result: VideoAnalysisResult,
  ) {
    super();
  }
}
