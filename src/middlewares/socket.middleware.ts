import { type NextFunction, type Request, type Response } from 'express';
import { Server } from 'socket.io';

export const socketIoMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (typeof _io === 'undefined') {
      const io = new Server({
        serveClient: false,
        cors: {
          origin: '*',
          credentials: true,
        },
      });

      global._io = io;
    }

    next();
  } catch (error) {
    next(error);
  }
};
