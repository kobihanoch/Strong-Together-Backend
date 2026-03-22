import { getIO } from '../config/webSocket.ts';
import { MessageAfterSendResponse } from '../types/dto/messages.dto.ts';

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
