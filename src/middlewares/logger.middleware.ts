import { type NextFunction, type Request, type Response } from 'express';

import { DiscordLoggerService } from '@/logger/discord.log';

const logger = new DiscordLoggerService();

export const pushLogToDiscord = (req: Request, res: Response, next: NextFunction) => {
  try {
    const NODE_ENV = process.env.NODE_ENV || "dev";
    if (NODE_ENV === 'dev') {
      logger.sendFormatCodeMsg({
        title: `Method: [${req.method}]`,
        code: (req.method === 'GET' ? req.query : req.body) as string,
        content: `\n${req.get('host')}${req.originalUrl}\n`,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
