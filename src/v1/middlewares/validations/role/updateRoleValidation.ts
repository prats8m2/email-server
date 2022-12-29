import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { CODE, MAX_LENGTH, VALIDATION } from '../../../../../config/config';

const updateRoleValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, name } = req.body;

  if (!id || !new RegExp(VALIDATION.uuid).test(id)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid role ID', id);
    return;
  }

  if (!name && name.length > MAX_LENGTH.ROLE_NAME) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid role name', name);
    return;
  }

  next();
};

export default updateRoleValidation;
