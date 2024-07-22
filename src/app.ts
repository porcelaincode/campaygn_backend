import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';

import { config } from './config/config';
import { requestLogger, logger } from './services/logger';

import authRoutes from './routes/authRoutes';
import influencerRoutes from './routes/influencerRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  })
);

app.use(
  session({
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: config.cookie.secure },
  })
);

app.use(requestLogger);

app.use('/auth', authRoutes);
app.use('/influencers', influencerRoutes);

mongoose
  .connect(config.mongoURI)
  .then(() => {
    logger.info('MongoDB connected');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
  });

const port = config.port;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

app.use(errorHandler);
