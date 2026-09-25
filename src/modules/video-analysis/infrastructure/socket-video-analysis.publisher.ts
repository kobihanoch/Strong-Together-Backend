import { Injectable } from '@nestjs/common';
import type { AnalyzeVideoResultPayloadDto, SquatRepetitionDto } from '@strong-together/shared';
import { SocketIOService } from '../../../infrastructure/capabilities/realtime/socket.io.service';
import type { VideoAnalysisResult } from '../application/models/video-analysis.models';
import { VideoAnalysisPublisher } from '../application/ports/video-analysis-publisher.port';

/** Socket.IO publisher for video-analysis results. */
@Injectable()
export class SocketVideoAnalysisPublisher implements VideoAnalysisPublisher {
  constructor(private readonly publisher: SocketIOService) {}

  publish(userId: string, result: VideoAnalysisResult): void {
    const payload: AnalyzeVideoResultPayloadDto<SquatRepetitionDto> = result;
    this.publisher.emitToUser(userId, 'video_analysis_results', payload);
  }
}
