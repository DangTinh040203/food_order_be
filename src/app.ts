// import '@/dbs/init.mongodb';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { corsConfig } from '@/configs/cors.config';
import ErrorHandling from '@/middlewares/errorHandling.middleware';
import { pushLogToDiscord } from '@/middlewares/logger.middleware';
import { socketIoMiddleware } from '@/middlewares/socket.middleware';
import router from '@/routes';

dotenv.config();

class Server {
  app: Express = express();

  constructor() {
    this.app = express();
    this.setupApplication();
  }

  setupApplication() {
    this.configureMiddlewares();
    this.customMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  configureMiddlewares() {
    this.app.use(cors(corsConfig));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(morgan('short'));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  customMiddleware() {
    this.app.use(pushLogToDiscord);
    this.app.use(socketIoMiddleware);
  }

  configureRoutes() {
    this.app.use(router);
  }

  configureErrorHandling() {
    this.app.use(ErrorHandling.notFoundError);
    this.app.use(ErrorHandling.globalError);
  }
}

export default Server;
