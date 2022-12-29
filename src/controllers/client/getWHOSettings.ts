import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import { CODE, ETL_META_DATA_DB } from '../../../config/config';
import { ClientRepository } from '../../repository/client';
import { getCustomRepository } from 'typeorm';
import { getWHO } from '../../services/medra/getWHO.service';
import DECRYPT from '../../utility/decrypt';
import Logger from '../../utility/logger';

const getWHOSettings = async (req: Request, res: Response) => {
  try {
    //fetch data from params
    const { clientId } = req.params;
    Logger.info(`Fetch WHO settings`);
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
      medraUsername: user,
      medraPort: port,
    } = client.config;

    //connect with Medra DB
    const result = await getWHO(
      host,
      port,
      ETL_META_DATA_DB,
      user,
      DECRYPT(pass)
    );
    let typeB = false;
    let typeC = false;
    let value = null;
    for (let index = 0; index < result.length; index++) {
      const data = result[index];
      if (data.load_type === 'WHO_B' && data.load_flag === '1') {
        typeB = true;
      }
      if (data.load_type === 'WHO_C' && data.load_flag === '1') {
        typeC = true;
      }
    }

    if (typeB) {
      value = 'B';
    }

    if (typeC) {
      value = 'C';
    }

    if (result.length) {
      sendResponse(res, true, CODE.SUCCESS, 'WHO dictionary data', { value });
    } else {
      sendResponse(
        res,
        false,
        CODE.SERVER_ERROR,
        'Not able to connect with ETL DB'
      );
    }
  } catch (_e) {
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default getWHOSettings;
