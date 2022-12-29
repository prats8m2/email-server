import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { CODE, MAX_LENGTH } from '../../../../config/config';

const addRoleValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  if (!name && name.length > MAX_LENGTH.ROLE_NAME) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid role name', name);
    return;
  }

  if (name === '') {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid role name', name);
    return;
  }

  // if (!folders.length) {
  //   sendResponse(res, false, CODE.INVALID_KEY, "Invalid folder name", folders);
  //   return;
  // }

  next();
};

export default addRoleValidation;
