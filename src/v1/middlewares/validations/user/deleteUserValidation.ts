import { VALIDATION, ROLES, CODE } from '../../../../../config/config';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';

const deleteAdminValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from params
  const { id } = req.params;
  //fetch data from token
  const { loggedInRole } = res.locals;

  //check for data VALIDATION
  if (!id || !new RegExp(VALIDATION.uuid).test(id)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid admin ID', id);
    return;
  }

  if (loggedInRole !== ROLES.SUPER_ADMIN && loggedInRole !== ROLES.ADMIN) {
    sendResponse(
      res,
      false,
      CODE.UNAUTHORIZED,
      'Permission denied!',
      loggedInRole
    );
    return;
  }
  next();
};

export default deleteAdminValidation;
