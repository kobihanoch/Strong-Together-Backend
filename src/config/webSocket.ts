import { createServer, Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { decodeSocketToken } from '../utils/tokenUtils.ts';
import createError from 'http-errors';
import { createRedisAdapterClients } from './redisClient.ts';
import { Express } from 'express';

type SocketUser = {
  id: string;
  username: string | null;
};

type AuthedSocket = Socket & {
  user?: SocketUser;
};

let io: Server | null = null;
export const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized!');
  return io;
};
export const setIO = (val: Server): void => {
  io = val;
};

export const createIOServer = async (app: Express): Promise<{ io: Server; server: HttpServer }> => {
  const server = createServer(app);
  io = new Server(server, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  if (process.env.ENABLE_SOCKET_REDIS_ADAPTER === 'true') {
    try {
      const { createAdapter } = await import('@socket.io/redis-adapter');
      const { pubClient, subClient } = await createRedisAdapterClients();
      io.adapter(createAdapter(pubClient, subClient));
      console.log('[Web Socket]: Redis adapter enabled');
    } catch (e) {
      if (e instanceof Error)
        console.warn(`[Web Socket]: Redis adapter unavailable, continuing without it: ${e.message}`);
    }
  }

  // --- Authenticate before connection is accepted ---
  io.use(async (socket, next) => {
    const authedSocket = socket as AuthedSocket;

    try {
      const ticket = authedSocket.handshake?.auth?.ticket;
      if (!ticket) return next(createError(400, 'Missing ticket'));

      const payload = decodeSocketToken(ticket);
      if (!payload) return next(createError(401, 'Invalid or expired ticket'));

      authedSocket.user = { id: payload.id, username: payload.username };
      return next();
    } catch {
      return next(createError(401, 'Unauthorized'));
    }
  });

  // --- Connection is authenticated here ---
  io.on('connection', (socket) => {
    const authedSocket = socket as AuthedSocket;
    const { id: userId, username } = authedSocket.user || {};

    // Join per-user room
    socket.join(userId!);

    console.log('[Web Socket]: User connected:', username);

    socket.on('user_loggedin', () => {
      // Optional: handle post-login init
    });

    socket.on('disconnect', (reason) => {
      console.log('[Web Socket]:', username, 'disconnected:', reason);
    });
  });

  setIO(io);
  return { io, server };
};
