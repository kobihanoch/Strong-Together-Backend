// socket.io.module.ts
import { Global, Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Server } from 'socket.io';
import { SocketIOService } from './socket.io.service.ts';
import { SOCKET_IO } from './socket.io.tokens.ts';

@Global()
@Module({
  providers: [
    SocketIOService,
    {
      provide: SOCKET_IO,
      useFactory: (adapterHost: HttpAdapterHost) => {
        const httpServer = adapterHost.httpAdapter.getHttpServer();
        const io = new Server(httpServer, {
          path: '/socket.io',
          cors: { origin: '*', credentials: true },
          transports: ['websocket', 'polling'],
        });
        return io;
      },
      inject: [HttpAdapterHost],
    },
  ],
  exports: [SOCKET_IO, SocketIOService],
})
export class SocketIOModule {}
