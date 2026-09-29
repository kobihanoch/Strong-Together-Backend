import type { SquatRepetition } from '../models/video-analysis.models';
import type { VideoAnalysisResultEvent } from '../../domain/entities/video-analysis-result-event';

/** Publishes completed video-analysis results to users. */
export abstract class VideoAnalysisPublisher {
  abstract publish(event: VideoAnalysisResultEvent<SquatRepetition>): void;
}
