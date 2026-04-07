import { getIO } from '../../infrastructure/socket.io.ts';
import { MessageAfterSendResponse } from '../types/dto/messages.dto.ts';
import { AnalyzeVideoResultPayload, SquatRepetition } from '../types/dto/video-analysis.dto.ts';
import { UserEntity } from '../types/entities/user.entity.ts';

export const emitNewMessage = (userId: string, msg: MessageAfterSendResponse) => {
  try {
    getIO().to(userId).emit('new_message', msg);
  } catch (error) {
    if (error instanceof Error && error.message === 'Socket.IO not initialized!') {
      return;
    }

    throw error;
  }
};

export const emitVideoAnalysisResults = (
  userId: UserEntity['id'],
  results: AnalyzeVideoResultPayload<SquatRepetition>,
) => {
  try {
    getIO().to(userId).emit(`video_analysis_results`, results);
  } catch (error) {
    if (error instanceof Error && error.message === 'Socket.IO not initialized!') {
      return;
    }

    throw error;
  }
};
