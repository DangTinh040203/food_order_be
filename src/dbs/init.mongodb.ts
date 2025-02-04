import mongoose from 'mongoose';

import config from '@/configs/app.config';

type DB = 'mongo' | 'mysql';

class Database {
  constructor() {
    this.connect();
  }

  public static instance: Database;

  connect(type: DB = 'mongo') {
    switch (type) {
      case 'mongo':
        mongoose
          .connect(config.db.connectionString)
          .then(() => {
            console.log('[Database] Connected to MongoDB');
          })
          .catch((error) => {
            console.error('[Error] Error connecting to MongoDB');
          });
        break;
      case 'mysql':
        break;
      default:
        break;
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
export default instanceMongodb;
