'use strict';
import mongoose from 'mongoose';
import { countConnect } from '@/helpers/check.connect';
import config from '@/configs/config.mongodb';

const { host, port, name } = config.db;

const connectString = `mongodb://${host}:${port}/${name}`;

// Singleton pattern for database
class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    if (type === 'mongodb') {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('MongoDB connected', countConnect());
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instance = Database.getInstance();

export default instance;
