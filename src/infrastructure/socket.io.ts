import { Server as HttpServer } from 'http';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { redisConfig } from '../config/redis.config.ts';
import { createRedisAdapterClients } from './redis.client.ts';
import { createLogger } from './logger.ts';
import { decodeSocketToken } from '../modules/web-sockets/web-sockets.utils.ts';

type SocketUser = {
  id: string;
  username: string | null;
};

type AuthedSocket = Socket & {
  user?: SocketUser;
};

let io: Server | null = null;
const logger = createLogger('config:websocket');
export const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized!');
  return io;
};
export const setIO = (val: Server): void => {
  io = val;
};

export const createIOServer = async (server: HttpServer): Promise<{ io: Server; server: HttpServer }> => {
  io = new Server(server, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  if (redisConfig.enableSocketAdapter) {
    try {
      const { createAdapter } = await import('@socket.io/redis-adapter');
      const { pubClient, subClient } = await createRedisAdapterClients();
      io.adapter(createAdapter(pubClient, subClient));
      logger.info({ event: 'websocket.redis_adapter_enabled' }, 'WebSocket Redis adapter enabled');
    } catch (e) {
      if (e instanceof Error)
        logger.warn(
          { err: e, event: 'websocket.redis_adapter_unavailable' },
          'WebSocket Redis adapter unavailable, continuing without it',
        );
    }
  }

  // --- Authenticate before connection is accepted ---
  io.use(async (socket, next) => {
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

  // --- Connection is authenticated here ---
  io.on('connection', (socket) => {
    const authedSocket = socket as AuthedSocket;
    const { id: userId, username } = authedSocket.user || {};
    const socketLogger = logger.child({
      socketId: socket.id,
      userId,
      username,
    });

    // Join per-user room
    socket.join(userId!);

    socketLogger.info({ event: 'websocket.user_connected' }, 'WebSocket user connected');

    socket.on('user_loggedin', () => {
      // Optional: handle post-login init
    });

    socket.on('disconnect', (reason) => {
      socketLogger.info({ event: 'websocket.user_disconnected', reason }, 'WebSocket user disconnected');
    });
  });

  setIO(io);
  return { io, server };
};
