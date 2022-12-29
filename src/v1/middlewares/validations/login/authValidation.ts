import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { CODE } from '../../../../../config/config';

const authValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { account, username, password } = req.body;

  if (!account) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid account name', account);
    return;
  }

  if (!username) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid username', username);
    return;
  }

  if (!password) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid password ', password);
    return;
  }
  next();
};

export default authValidation;
