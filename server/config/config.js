import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    user: 'postgres',
    password: process.env.DB_PASS,
    database: 'CBT_db',
    host: '127.0.0.1',
    port: 5432,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
  },
};
