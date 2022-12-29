import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../utility/response';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET_KEY, CODE } from '../../../config/config';

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req?.headers?.token?.toString();
  if (typeof token !== 'undefined') {
    try {
      const data: any = verify(token, JWT_SECRET_KEY);
      const { role, id } = data;
      res.locals.loggedInId = id;
      res.locals.loggedInRole = role[0]?.name;
      next();
    } catch (_e) {
      const e: Error = _e;

      if (e.message === 'invalid signature') {
        sendResponse(
          res,
          false,
          CODE.INVALID_TOKEN,
          'Invalid reset password token!'
        );
        return false;
      }

      if (e.message === 'jwt expired') {
        sendResponse(res, false, CODE.JWT_EXPIRE, 'Session expired!');
        return false;
      }

      sendResponse(res, false, CODE.INVALID_TOKEN, e.message);
    }
  } else {
    sendResponse(res, false, CODE.UNAUTHORIZED, 'Not Authorized');
  }
};

export default AuthMiddleware;
