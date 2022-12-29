import { VALIDATION, CODE } from '../../../../config/config';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import isValidAdmin from '../../../helpers/client/isValidAdmin';

const deleteClientValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from params
  const { id } = req.params;
  //fetch data from token
  const { loggedInRole, loggedInId } = res.locals;

  //check for data VALIDATION
  if (!id || !new RegExp(VALIDATION.uuid).test(id)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client ID', id);
    return;
  }

  if (!(await isValidAdmin(id, loggedInId, loggedInRole))) {
    sendResponse(
      res,
      false,
      CODE.UNAUTHORIZED,
      'Permission denied!',
      loggedInRole
    );
  }
  next();
};

export default deleteClientValidation;
