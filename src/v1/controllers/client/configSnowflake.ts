import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import sendResponse from '../../utility/response';
import { ClientConfigRepository } from '../../repository/clientConfig';
import { CODE } from '../../../../config/config';
import SnowflakeService from '../../services/snowflake/snowflake';
import ENCRYPT from '../../utility/encrypt';
import DECRYPT from '../../utility/decrypt';
import Logger from '../../utility/logger';

const configSnowflake = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const {
      id,
      snowflakeAccount,
      snowflakeUsername,
      snowflakeDatabase,
      snowflakeRole,
      snowflakeWarehouse,
    } = req.body;

    let { snowflakePassword } = req.body;
    Logger.info(`Configure Snowflake`);

    //fetch data from token
    const { loggedInId: updatedBy } = res.locals;

    const clientRepo = getCustomRepository(ClientRepository);
    const configRepo = getCustomRepository(ClientConfigRepository);
    //get config id from client table
    const client = await clientRepo.getClientDetails({ id });
    snowflakePassword = snowflakePassword
      ? snowflakePassword
      : DECRYPT(client.config.snowflakePassword);

    const config = {
      ...req.body,
      snowflakePassword: ENCRYPT(snowflakePassword),
      id: client?.config.id,
      updatedBy,
    };

    const snowflakeService = new SnowflakeService(
      snowflakeAccount,
      snowflakeUsername,
      snowflakePassword,
      snowflakeDatabase,
      snowflakeRole,
      snowflakeWarehouse,
      false
    );

    snowflakeService.connection.connect(async function (err: any) {
      if (err) {
        console.error('Unable to connect: ' + err.message);
        sendResponse(res, false, CODE.DENIED, err.message);
      } else {
        const result = await configRepo.updateClientConfig(config);
        Logger.info(`Snowflake configuration updated`);
        sendResponse(
          res,
          true,
          CODE.SUCCESS,
          'Snowflake config updated successfully',
          result
        );
      }
    });
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

export default configSnowflake;
