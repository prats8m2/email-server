import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import { CODE } from '../../../../config/config';
import { ClientRepository } from '../../repository/client';
import { getCustomRepository } from 'typeorm';
import { getMedra } from '../../services/medra/getMedra.Service';
import DECRYPT from '../../utility/decrypt';
import Logger from '../../utility/logger';

const getMedraSettings = async (req: Request, res: Response) => {
  try {
    //fetch data from params
    const { clientId } = req.params;
    Logger.info(`Fetch Medra settings`);
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
    const result = await getMedra(host, port, db, user, DECRYPT(pass));
    const value = result[0].load_flag === '1' ? true : false;
    if (result.length) {
      sendResponse(res, true, CODE.SUCCESS, 'MedDRA DB data', { value });
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

export default getMedraSettings;
