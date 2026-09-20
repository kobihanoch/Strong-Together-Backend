import { Injectable } from '@nestjs/common';
import type { VideoAnalysisResult } from '../models/video-analysis.models';
import { VideoAnalysisPublisher } from '../ports/video-analysis-publisher.port';

/** Publishes a worker result to the owning user. */
@Injectable()
export class PublishVideoAnalysisResultUseCase {
  constructor(private readonly publisher: VideoAnalysisPublisher) {}

  /**
   * Publishes a completed or failed analysis result.
   * @param result - The validated worker result.
   * @returns Nothing.
   */
  execute(result: VideoAnalysisResult): void {
    this.publisher.publish(result.userId, result);
  }
}
