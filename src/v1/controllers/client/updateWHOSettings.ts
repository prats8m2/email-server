import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import { CODE } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import { updateWHO } from '../../services/medra/updateWHO.service';
import DECRYPT from '../../utility/decrypt';
import addLogsForDictionary from '../../helpers/client/addLogsForDictionary';
import Logger from '../../utility/logger';

const updateWHOSettings = async (req: Request, res: Response) => {
  try {
    //fetch data from params
    const { clientId } = req.params;
    const { status, oldData } = req.body;

    const { loggedInId } = res.locals;
    Logger.info(`Update WHO settings`);
    //fetch client data
    const clientRepo = getCustomRepository(ClientRepository);
    const client = await clientRepo.getClientDetails({ id: clientId });

    if (!client) {
      //check for client
      sendResponse(res, false, CODE.NOT_FOUND, 'Client not found', client);
      return;
    }

    if (!client.config.medraHost) {
      //check for client
      sendResponse(
        res,
        false,
        CODE.NOT_FOUND,
        'Please update ETL config',
        client
      );
      return;
    }

    //fetch medra db details
    const {
      medraHost: host,
      medraPass: pass,
      medraDBName: db,
      medraUsername: user,
      medraPort: port,
    } = client.config;

    //connect with Medra DB
    const result = await updateWHO(host, port, db, user, DECRYPT(pass), status);
    if (result) {
      addLogsForDictionary(clientId, status, loggedInId, oldData);
      sendResponse(
        res,
        true,
        CODE.SUCCESS,
        'WHO dictionary settings updated successfully',
        result
      );
    } else {
      sendResponse(
        res,
        false,
        CODE.SERVER_ERROR,
        'Not able to connect with MedDRA DB'
      );
    }
  } catch (_e) {
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default updateWHOSettings;
