import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import { CODE } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import { updateMedra } from '../../services/medra/updateMedra.Service ';
import DECRYPT from '../../utility/decrypt';
import addLogsForDictionary from '../../helpers/client/addLogsForDictionary';
import Logger from '../../utility/logger';

const updateMedraSettings = async (req: Request, res: Response) => {
  try {
    //fetch data from params
    const { clientId } = req.params;
    const { value, oldData } = req.body;

    const { loggedInId } = res.locals;
    Logger.info(`Update medra setting`);
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
    const result = await updateMedra(
      host,
      port,
      db,
      user,
      DECRYPT(pass),
      value
    );
    if (result) {
      addLogsForDictionary(clientId, value, loggedInId, oldData);
      sendResponse(
        res,
        true,
        CODE.SUCCESS,
        'MedDRA DB updated successfully',
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

export default updateMedraSettings;
