import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  appUrl: process.env.APP_URL,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/app',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  cookie: {
    secure: (process.env.SESSION_COOKIE_SECURE || true) as boolean,
  },
  elasticsearch: {
    host: process.env.ELASTICSEARCH_HOST || 'localhost',
    port: process.env.ELASTICSEARCH_PORT || '9200',
  },
};
