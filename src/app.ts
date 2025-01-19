// import '@/dbs/init.mongodb';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { corsConfig } from '@/configs/cors.config';
import ErrorHandling from '@/middlewares/errorHandling';
import router from '@/routes';

class Server {
  app: Express = express();

  constructor() {
    this.app = express();
    this.setupApplication();
  }

  setupApplication() {
    this.configureMiddlewares();
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

  configureRoutes() {
    this.app.use(router);
  }

  configureErrorHandling() {
    this.app.use(ErrorHandling.notFoundError);
    this.app.use(ErrorHandling.globalError);
  }
}

export default Server;
