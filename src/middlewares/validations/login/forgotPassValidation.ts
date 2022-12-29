import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { VALIDATION, CODE } from '../../../../config/config';

const forgotPassValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { account, username, email } = req.body;

  if (!account) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid account name', account);
    return;
  }

  if (!username) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid username', username);
    return;
  }

  if (
    !email ||
    !new RegExp(VALIDATION.email).test(email) ||
    email.length > 300
  ) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid  email', email);
    return;
  }

  next();
};

export default forgotPassValidation;
