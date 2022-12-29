import { JWT_SECRET_KEY, SESSION_EXPIRE_TIME } from '../../config/config';
import jwt from 'jsonwebtoken';
import random from 'random';

export const createToken = (data: any) => {
  return jwt.sign(
    {
      id: data.id,
      name: data.name,
      email: data.email,
      isFirstLogin: data.isFirstLogin,
      role: data.role,
      exp: Math.floor(Date.now() / 1000) + 60 * SESSION_EXPIRE_TIME,
    },
    JWT_SECRET_KEY
  );
};

export const generateResetPassLink = (): string => {
  return Math.floor(random.next() * (999999 - 100000 + 1) + 100000).toString();
};
