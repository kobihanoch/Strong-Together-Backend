import { Injectable } from '@nestjs/common';
import { SocketIOService } from '../../../infrastructure/socket.io/socket.io.service';
import type { VideoAnalysisResult } from '../application/models/video-analysis.models';
import { VideoAnalysisPublisher } from '../application/ports/video-analysis-publisher.port';

/** Socket.IO publisher for video-analysis results. */
@Injectable()
export class SocketVideoAnalysisPublisher implements VideoAnalysisPublisher {
  constructor(private readonly publisher: SocketIOService) {}

  publish(userId: string, result: VideoAnalysisResult): void {
    this.publisher.emitToUser(userId, 'video_analysis_results', result);
  }
}
