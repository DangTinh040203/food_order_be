import type { JwtPayload } from 'jsonwebtoken';
import type { Server } from 'socket.io';

declare global {
  // eslint-disable-next-line no-var
  var _io: Server | undefined;

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
