import { config } from 'dotenv';
config();

export default {
  development: {
    dialect: 'postgres',
    url:
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public` ||
      '',
  },
};
