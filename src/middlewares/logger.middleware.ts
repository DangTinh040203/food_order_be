import { type NextFunction, type Request, type Response } from 'express';

import { DiscordLoggerService } from '@/logger/discord.log';

const logger = new DiscordLoggerService();

export const pushLogToDiscord = (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.sendFormatCodeMsg({
      title: `Method: [${req.method}]`,
      code: (req.method === 'GET' ? req.query : req.body) as string,
      content: `\n${req.get('host')}${req.originalUrl}\n`,
    });
    next();
  } catch (error) {
    next(error);
  }
};
