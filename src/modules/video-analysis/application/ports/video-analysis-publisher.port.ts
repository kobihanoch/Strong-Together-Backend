import type { VideoAnalysisResult } from '../models/video-analysis.models';

/** Publishes completed video-analysis results to users. */
export abstract class VideoAnalysisPublisher {
  abstract publish(userId: string, result: VideoAnalysisResult): void;
}
