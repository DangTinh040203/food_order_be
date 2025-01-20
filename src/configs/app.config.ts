import dotenv from 'dotenv';

dotenv.config({ path: ['.env'] });

interface Config {
  app: {
    port: number;
    host: string;
  };
  db: {
    connectionString: string;
  };
}

const dev: Config = {
  app: {
    port: Number(process.env.DEV_APP_PORT) || 3000,
    host: process.env.DEV_APP_HOST ?? 'localhost',
  },
  db: {
    connectionString: process.env.MONGO_DB_CONNECTION_STRING!,
  },
};

const prod: Config = {
  app: {
    port: Number(process.env.PROD_APP_PORT) || 3000,
    host: process.env.PROD_APP_HOST ?? 'localhost',
  },
  db: {
    connectionString: process.env.MONGO_DB_CONNECTION_STRING!,
  },
};

type Env = 'dev' | 'prod';

const configs: Record<Env, Config> = {
  dev,
  prod,
};

const env: Env = (process.env.NODE_ENV as Env) ?? 'dev';
export default configs[env];
