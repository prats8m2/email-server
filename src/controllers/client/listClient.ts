import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { MAX_ROW, ROLES, CODE } from '../../../config/config';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';

const listClient = async (req: Request, res: Response) => {
  try {
    //fetch data from query
    const { row = MAX_ROW, page = 1, status = undefined } = req.query;

    Logger.info(`List client request`);
    //fetch data from token
    const { loggedInId, loggedInRole } = res.locals;
    //create client repo instance
    const clientRepo = getCustomRepository(ClientRepository);
    let list = [];
    let count = 0;
    if (loggedInRole === ROLES.ADMIN) {
      //get all list of clients for this admin only
      [list, count] = await clientRepo.getAllClientByAdmin(
        row,
        page,
        loggedInId,
        status?.toString()
      );
    } else {
      //get all list of clients
      [list, count] = await clientRepo.getAllClient(
        row,
        page,
        status?.toString()
      );
    }

    //send API response
    sendResponse(res, true, CODE.SUCCESS, 'Client List', { count, list });
  } catch (_e) {
    Logger.error(_e);
    console.log('~ _e', _e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default listClient;
