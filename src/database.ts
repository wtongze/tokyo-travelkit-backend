import 'dotenv/config';
import { Sequelize } from 'sequelize';

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3',
  logging: false,
});

export default database;
