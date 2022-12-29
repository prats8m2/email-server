import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import sendResponse from '../../utility/response';
import { ClientConfigRepository } from '../../repository/clientConfig';
import { CODE } from '../../../config/config';
import DECRYPT from '../../utility/decrypt';
import ENCRYPT from '../../utility/encrypt';
import Logger from '../../utility/logger';

const updateAirflow = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { id, airflowENV, awsRegion } = req.body;
    Logger.info(`Update airflow request`);
    let { awsAccessKey, awsSecretKey } = req.body;

    //fetch data from token
    const { loggedInId: updatedBy } = res.locals;

    const clientRepo = getCustomRepository(ClientRepository);
    const configRepo = getCustomRepository(ClientConfigRepository);

    //get config id from client table
    const client = await clientRepo.getClientDetails({ id });
    awsAccessKey = awsAccessKey
      ? awsAccessKey
      : DECRYPT(client.config.awsAccessKey);

    awsSecretKey = awsSecretKey
      ? awsSecretKey
      : DECRYPT(client.config.awsSecretKey);

    const config = {
      id: client?.config.id,
      airflowENV,
      awsAccessKey: ENCRYPT(awsAccessKey),
      awsSecretKey: ENCRYPT(awsSecretKey),
      awsRegion,
      updatedBy,
    };
    const result = await configRepo.updateClientConfig(config);
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      'Airflow URL updated successfully',
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

export default updateAirflow;
