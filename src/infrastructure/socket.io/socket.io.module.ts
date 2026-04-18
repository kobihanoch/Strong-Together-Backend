// socket.io.module.ts
import { Global, Module } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketIOService } from './socket.io.service';
import { SOCKET_IO } from './socket.io.tokens';

@Global()
@Module({
  providers: [
    SocketIOService,
    {
      provide: SOCKET_IO,
      useFactory: () => new Server(),
    },
  ],
  exports: [SOCKET_IO, SocketIOService],
})
export class SocketIOModule {}
