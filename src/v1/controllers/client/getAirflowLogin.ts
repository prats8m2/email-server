import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import { CODE } from '../../../../config/config';
import { MWAAClient, CreateWebLoginTokenCommand } from '@aws-sdk/client-mwaa';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import DECRYPT from '../../utility/decrypt';
import Logger from '../../utility/logger';

const getAirflowLogin = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { clientId: id } = req.params;
    Logger.info(`Fetch airflow config`);
    const clientRepo = getCustomRepository(ClientRepository);

    const clientData = await clientRepo.getClientDetails({ id });

    if (!clientData) {
      sendResponse(res, false, CODE.NOT_FOUND, 'Client not found');
      return;
    }

    if (!clientData?.config?.airflowENV) {
      sendResponse(
        res,
        false,
        CODE.NOT_FOUND,
        'Please update airflow configuration'
      );
      return;
    }

    const { awsRegion, awsAccessKey, awsSecretKey, airflowENV } =
      clientData.config;

    const client = new MWAAClient({
      region: awsRegion,
      credentials: {
        accessKeyId: DECRYPT(awsAccessKey),
        secretAccessKey: DECRYPT(awsSecretKey),
      },
    });

    const command = new CreateWebLoginTokenCommand({
      Name: airflowENV,
    });

    const data = await client.send(command);
    const url = `https://${data.WebServerHostname}/aws_mwaa/aws-console-sso?login=true#${data.WebToken}`;
    sendResponse(res, true, CODE.SUCCESS, 'Airflow login', url);
  } catch (_e) {
    if (
      _e.message === 'Invalid region in client config' ||
      _e.message === 'Environment not found' ||
      _e.message === 'The security token included in the request is invalid.'
    ) {
      sendResponse(
        res,
        false,
        CODE.SERVER_ERROR,
        _e.message,
        'Some error occurred'
      );
    } else {
      sendResponse(
        res,
        false,
        CODE.SERVER_ERROR,
        _e.message,
        'Some error occurred'
      );
    }
  }
};

export default getAirflowLogin;
