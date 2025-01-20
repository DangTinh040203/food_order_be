import { type NextFunction, type Request, type Response } from 'express';
import { Server } from 'socket.io';

import { SOCKET_EVENTS } from '@/constants/socket';
import { SocketService } from '@/services/Socket.service';

export const setupSocketIoMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const io = new Server({
    serveClient: false,
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  _io = io;
  _io.on(SOCKET_EVENTS.CONNECTION, SocketService.connection);
  next();
};
