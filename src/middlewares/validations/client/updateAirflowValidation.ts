import { ROLES, MAX_ROW, CODE } from '../../../../config/config';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../../repository/client';

const updateAirflowValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from body
  const { id } = req.body;

  //fetch data from token
  const { loggedInRole, loggedInId } = res.locals;

  //VALIDATION foe mandatory field
  // if (!airflowURL) {
  //   sendResponse(res, false, CODE.INVALID_KEY, "Invalid Airflow URL");
  //   return;
  // }

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

export default updateAirflowValidation;
