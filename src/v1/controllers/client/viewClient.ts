import { Request, Response } from 'express';

import { ClientRepository } from '../../repository/client';
import { getCustomRepository } from 'typeorm';
import sendResponse from '../../utility/response';
import Logger from '../../utility/logger';
import { ClientI } from '../../interface/client/client';
import { CODE } from '../../../../config/config';
import { fetchAdminCreds } from '../../helpers/client/fetchAdminCreds';

const viewClient = async (req: Request, res: Response) => {
  try {
    //get params
    const { id } = req.params;
    Logger.info(`View client request`);
    //create repo instance
    const clientRepo = getCustomRepository(ClientRepository);

    //get data from the db
    const clientData: ClientI = await clientRepo.getClientDetails({ id });
    if (clientData) {
      const { adminUsername } = fetchAdminCreds(clientData);
      const result = {
        ...clientData,
        adminUsername,
      };
      sendResponse(res, true, CODE.SUCCESS, 'Client data', result);
    } else {
      sendResponse(res, false, CODE.NOT_FOUND, 'Client not exist', clientData);
    }
  } catch (_e) {
    Logger.error(_e);
    console.log('~ _e', _e);
    sendResponse(
      res,
      false,
      CODE.SERVER_ERROR,
      'Some error occurred',
      _e.message
    );
  }
};

export default viewClient;
