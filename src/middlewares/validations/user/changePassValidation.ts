import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { VALIDATION, CODE } from '../../../../config/config';

const changePassValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || !new RegExp(VALIDATION.password).test(newPassword)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid new password');
    return false;
  }

  if (
    !currentPassword ||
    !new RegExp(VALIDATION.password).test(currentPassword)
  ) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid current password');
    return false;
  }

  next();
};

export default changePassValidation;
