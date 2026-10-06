import { Injectable } from '@nestjs/common';
import { SocketIOService } from '../../../../infrastructure/capabilities/realtime/socket.io.service';
import type { DeliveredMessage } from '../application/models/system-messages.models';
import { MessagePublisher } from '../application/ports/message-publisher.port';

/** Socket.IO adapter that publishes committed messages to online users. */
@Injectable()
export class SocketMessagePublisher implements MessagePublisher {
  constructor(private readonly publisher: SocketIOService) {}
  publishToUser(userId: string, message: DeliveredMessage): void {
    this.publisher.emitToUser(userId, 'new_message', message);
  }
}
