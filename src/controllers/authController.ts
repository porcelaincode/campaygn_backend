import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User, IUser } from '../models/User';
import { config } from '../config/config';
import { messages } from '../config/messages';

// utils
import { logger } from '../services/logger';
import { addToBlacklist } from '../plugins/blacklistToken';

export const register = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: messages.register.success.registered });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error: messages.register.error.cannotRegister });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findOne({ email: req.body.email });

    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).send({
        error: messages.login.error.invalidCreds,
      });
    }
    const token = jwt.sign(user.toObject(), config.jwtSecret, {
      expiresIn: '12h',
    });
    res.send({ email: user.email, name: user.name, token });
  } catch (error) {
    logger.error(error); // Log the actual error for debugging
    res.status(500).send({
      error: messages.login.error.incorrectPassword,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).send({ error: 'Token is required' });
    }

    addToBlacklist(token);

    res.status(200).send({ message: messages.auth.logout.success });
  } catch (error) {
    res
      .status(500)
      .send({ error: messages.auth.logout.error.internalServerError });
  }
};
