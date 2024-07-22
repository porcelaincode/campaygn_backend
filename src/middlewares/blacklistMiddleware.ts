import { Request, Response, NextFunction } from 'express';
import { isBlacklisted } from '../plugins/blacklistToken';

export const checkBlacklist = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token && isBlacklisted(token)) {
    return res.status(401).send({ error: 'Token has been invalidated' });
  }

  next();
};
