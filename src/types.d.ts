import type { JwtPayload } from 'jsonwebtoken';
import type { Server } from 'socket.io';

declare global {
  let _io: Server;

  namespace Express {
    interface Request {
      jwtDecoded: JwtPayload;
      post?: {
        validatedQuery: {
          page: number;
          limit: number;
          order: 'asc' | 'desc';
        };
      };
    }
  }
}
