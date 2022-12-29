import { ROLES, CODE } from '../../../../../config/config';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';

const listAdminValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from token
  const { loggedInRole } = res.locals;

  if (loggedInRole !== ROLES.SUPER_ADMIN) {
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

export default listAdminValidation;
