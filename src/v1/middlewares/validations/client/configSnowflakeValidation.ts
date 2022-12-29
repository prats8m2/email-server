import { ROLES, MAX_ROW, CODE } from '../../../../../config/config';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../../repository/client';

const configSnowflakeValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from body
  const {
    id,
    snowflakeAccount,
    snowflakeUsername,
    snowflakeDatabase,
    snowflakeRole,
    snowflakeWarehouse,
  } = req.body;

  //fetch data from token
  const { loggedInRole, loggedInId } = res.locals;

  //VALIDATION foe mandatory field
  if (!snowflakeAccount) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid account name');
    return;
  }

  if (!snowflakeUsername) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid username');
    return;
  }

  // if (!snowflakePassword) {
  //   sendResponse(res, false, CODE.INVALID_KEY, "Invalid password");
  //   return;
  // }

  if (!snowflakeDatabase) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid database');
    return;
  }

  if (!snowflakeRole) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid role');
    return;
  }

  if (!snowflakeWarehouse) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid warehouse');
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
        const clientId = allClients[index].id;
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

export default configSnowflakeValidation;
