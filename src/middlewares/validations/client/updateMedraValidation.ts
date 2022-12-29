import {
  ROLES,
  MAX_ROW,
  VALIDATION,
  MAX_LENGTH,
} from '../../../../config/config';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../../repository/client';
import { CODE } from '../../../../config/config';

const updateMedraValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from body
  const { id, medraHost, medraUsername, medraDBName, medraPort } = req.body;

  //fetch data from token
  const { loggedInRole, loggedInId } = res.locals;

  //VALIDATION foe mandatory field
  if (!medraHost || medraHost.length > MAX_LENGTH.MEDRA_HOST) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid Medra host name');
  }

  if (!medraUsername || medraUsername.length > MAX_LENGTH.MEDRA_USER_NAME) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid Medra user name');
  }

  // if (!medraPass || medraPass.length > MAX_LENGTH.MEDRA_PASS) {
  //   sendResponse(res, false, CODE.INVALID_KEY, "Invalid Medra user password");
  // }

  if (!medraDBName || medraDBName.length > MAX_LENGTH.MEDRA_DB_NAME) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid Medra database name');
  }

  if (typeof medraPort !== 'number') {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid Medra port');
  }

  if (!id || !new RegExp(VALIDATION.uuid).test(id)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client ID', id);
    return;
  }

  if (loggedInRole !== ROLES.SUPER_ADMIN) {
    if (loggedInRole === ROLES.ADMIN) {
      const clientRepo = getCustomRepository(ClientRepository);
      const [allClients, clientLength] = await clientRepo.getAllClientByAdmin(
        MAX_ROW,
        1,
        loggedInId
      );

      for (let index = 0; index < clientLength; index++) {
        const clientId = allClients[index]?.id;
        if (clientId === id) {
          next();
          break;
        }
      }
      sendResponse(
        res,
        false,
        CODE.UNAUTHORIZED,
        'Permission denied!',
        loggedInRole
      );
      return;
    } else {
      sendResponse(
        res,
        false,
        CODE.UNAUTHORIZED,
        'Permission denied!',
        loggedInRole
      );
      return;
    }
  }
  next();
};

export default updateMedraValidation;
