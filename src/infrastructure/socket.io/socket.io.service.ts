import { BadRequestException, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { Server, Socket } from 'socket.io';
import { decodeSocketToken } from '../../modules/web-sockets/web-sockets.utils';
import { createLogger } from '../logger';
import { SOCKET_ADAPTER_CLIENTS } from '../redis/redis.tokens';
import { SOCKET_IO } from './socket.io.tokens';
import { createAdapter } from '@socket.io/redis-adapter';

type SocketUser = {
  id: string;
  username: string | null;
};

type AuthedSocket = Socket & {
  user?: SocketUser;
};

@Injectable()
export class SocketIOService implements OnModuleInit {
  private readonly logger = createLogger('config:websocket');

  constructor(
    @Inject(SOCKET_ADAPTER_CLIENTS)
    private readonly socketAdapterClients: { pubClient: RedisClientType; subClient: RedisClientType },
    @Inject(SOCKET_IO) private readonly io: Server,
  ) {}

  async onModuleInit() {
    this.setUpRedisAdapter();
    this.setUpMiddleware();
    this.handleConnections();
    this.logger.info('SocketIOService initialized');
  }

  async setUpRedisAdapter() {
    if (this.socketAdapterClients) {
      const { pubClient, subClient } = this.socketAdapterClients;
      this.io.adapter(createAdapter(pubClient, subClient));
      this.logger.info({ event: 'websocket.redis_adapter_enabled' }, 'WebSocket Redis adapter enabled');
    }
  }

  async setUpMiddleware() {
    // --- Authenticate before connection is accepted ---
    this.io.use(async (socket, next) => {
      const authedSocket = socket as AuthedSocket;

      try {
        const ticket = authedSocket.handshake?.auth?.ticket;
        if (!ticket) return next(new BadRequestException('Missing ticket'));

        const payload = decodeSocketToken(ticket);
        if (!payload) return next(new UnauthorizedException('Invalid or expired ticket'));

        authedSocket.user = { id: payload.id, username: payload.username };
        return next();
      } catch {
        return next(new UnauthorizedException('Unauthorized'));
      }
    });
  }

  async handleConnections() {
    // --- Connection is authenticated here ---
    this.io.on('connection', (socket) => {
      const authedSocket = socket as AuthedSocket;
      const { id: userId, username } = authedSocket.user || {};
      const socketLogger = this.logger.child({
        socketId: socket.id,
        userId,
        username,
      });

      // Join per-user room
      if (!userId) {
        socketLogger.warn({ event: 'websocket.missing_user_id' }, 'WebSocket connection missing authenticated user id');
        socket.disconnect(true);
        return;
      }

      socket.join(userId);

      socketLogger.info({ event: 'websocket.user_connected' }, 'WebSocket user connected');

      socket.on('user_loggedin', () => {
        // Optional: handle post-login init
      });

      socket.on('disconnect', (reason) => {
        socketLogger.info({ event: 'websocket.user_disconnected', reason }, 'WebSocket user disconnected');
      });
    });
  }

  public emitToUser(userId: string, event: string, data: any) {
    this.io.to(userId).emit(event, data);
  }
}
