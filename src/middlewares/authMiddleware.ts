import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Session, SessionData } from 'express-session';

import { config } from '../config/config';
import { IUser } from '../models/User';
import { logger } from '../services/logger';

interface AuthenticatedRequest extends Request {
  session: Session & Partial<SessionData> & { user?: IUser };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .send({ error: 'Not authorized to access this resource' });
  }

  try {
    const payload: any = jwt.verify(token, config.jwtSecret);

    if (payload) {
      const { user } = payload;
      req.session.user = user;
      return next();
    } else {
      return res.status(401).send({ error: 'User login expired!' });
    }
  } catch (error) {
    return res
      .status(401)
      .send({ error: 'Not authorized to access this resource' });
  }
};
