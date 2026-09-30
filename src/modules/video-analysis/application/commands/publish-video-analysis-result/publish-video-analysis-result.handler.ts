import { VideoAnalysisPublisher } from '../../ports/video-analysis-publisher.port';
import { VideoAnalysisResultEvent } from '../../../domain/entities/video-analysis-result-event';
import { PublishVideoAnalysisResultCommand } from './publish-video-analysis-result.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Publishes a worker result to the owning user. */
@CommandHandler(PublishVideoAnalysisResultCommand)
export class PublishVideoAnalysisResultHandler implements ICommandHandler<PublishVideoAnalysisResultCommand> {
  constructor(private readonly publisher: VideoAnalysisPublisher) {}

  /**
   * Publishes a completed or failed analysis result.
   *
   * @param result - The validated worker result.
   * @returns Nothing.
   */
  async execute(command: PublishVideoAnalysisResultCommand): Promise<void> {
    const { result } = command;
    this.publisher.publish(VideoAnalysisResultEvent.create(result));
  }
}
