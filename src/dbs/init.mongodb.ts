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
            console.log('Connected to MongoDB');
          })
          .catch((error) => {
            console.log('Error connecting to MongoDB');
            console.error(error);
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
