import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import sendResponse from '../../utility/response';
import { ClientConfigRepository } from '../../repository/clientConfig';
import { checkMedraConnection } from '../../services/medra/Medra.Service';
import { CODE } from '../../../config/config';
import ENCRYPT from '../../utility/encrypt';
import DECRYPT from '../../utility/decrypt';
import Logger from '../../utility/logger';

const configMedra = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { id, medraHost, medraPort, medraUsername, medraDBName } = req.body;
    Logger.info(`Configure ETL DB`);
    let { medraPass } = req.body;

    //fetch data from token

    const clientRepo = getCustomRepository(ClientRepository);
    const configRepo = getCustomRepository(ClientConfigRepository);

    //get config id from client table
    const client = await clientRepo.getClientDetails({ id });
    const { loggedInId: updatedBy } = res.locals;

    medraPass = medraPass ? medraPass : DECRYPT(client.config.medraPass);

    //check if medra info is correct or not
    const connectionResult = await checkMedraConnection(
      medraHost,
      medraPort,
      medraDBName,
      medraUsername,
      medraPass
    );

    if (connectionResult !== true) {
      sendResponse(res, false, 801, connectionResult);
      return false;
    }

    medraPass = medraPass ? medraPass : DECRYPT(client.config.medraPass);
    const config = {
      id: client?.config.id,
      medraHost,
      medraUsername,
      medraPort,
      medraPass: ENCRYPT(medraPass),
      medraDBName,
      updatedBy,
    };
    const result = await configRepo.updateClientConfig(config);
    Logger.info(`ETl config updated successfully`);
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      'Medra DB updated successfully',
      result
    );
  } catch (_e) {
    console.log(_e);
    sendResponse(
      res,
      false,
      CODE.SERVER_ERROR,
      'Some error occurred',
      _e.message
    );
  }
};

export default configMedra;
