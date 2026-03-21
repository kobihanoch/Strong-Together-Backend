import { getIO } from '../config/webSocket.ts';
import { MessageAfterSendResponse } from '../types/dto/messages.dto.ts';

export const emitNewMessage = (userId: string, msg: MessageAfterSendResponse) => {
  getIO().to(userId).emit('new_message', msg);
};
