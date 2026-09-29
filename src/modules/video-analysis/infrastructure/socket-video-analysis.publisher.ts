import { Injectable } from '@nestjs/common';
import type { AnalyzeVideoResultPayloadDto, SquatRepetitionDto } from '@strong-together/shared';
import { SocketIOService } from '../../../infrastructure/capabilities/realtime/socket.io.service';
import { VideoAnalysisPublisher } from '../application/ports/video-analysis-publisher.port';
import type { VideoAnalysisResultEvent } from '../domain/entities/video-analysis-result-event';
import type { SquatRepetition } from '../application/models/video-analysis.models';

/** Socket.IO publisher for video-analysis results. */
@Injectable()
export class SocketVideoAnalysisPublisher implements VideoAnalysisPublisher {
  constructor(private readonly publisher: SocketIOService) {}

  publish(event: VideoAnalysisResultEvent<SquatRepetition>): void {
    const payload: AnalyzeVideoResultPayloadDto<SquatRepetitionDto> = event.payload;
    this.publisher.emitToUser(event.payload.userId, 'video_analysis_results', payload);
  }
}
