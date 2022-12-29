import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { VALIDATION, CODE } from '../../../../config/config';

const resetPassValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, otp, password } = req.body;

  if (!password || !new RegExp(VALIDATION.password).test(password)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid password');
    return false;
  }

  if (!id) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid ID');
    return false;
  }

  if (!otp) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid OTP');
    return false;
  }

  next();
};

export default resetPassValidation;
