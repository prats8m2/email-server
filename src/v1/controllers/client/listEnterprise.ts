import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import { CODE, USER_TYPE } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import SnowflakeService from '../../services/snowflake/snowflake';
import DECRYPT from '../../utility/decrypt';
import Logger from '../../utility/logger';
import { UserRepository } from '../../repository/user';

const listEnterprise = async (req: Request, res: Response) => {
  try {
    const { clientId: id } = req.params;
    Logger.info(`List enterprise request`);
    const { loggedInId, loggedInRole } = res.locals;

    if (loggedInRole !== USER_TYPE.USER) {
      //fetch snowflake details
      const clientRepo = getCustomRepository(ClientRepository);
      const client = await clientRepo.getClientDetails({ id });
      if (!client?.config?.snowflakeAccount) {
        sendResponse(
          res,
          false,
          CODE.NOT_FOUND,
          `Please add snowflake config for client ${client.name}`
        );
        return;
      }
      const snowflakeService = new SnowflakeService(
        client?.config.snowflakeAccount,
        client?.config.snowflakeUsername,
        DECRYPT(client?.config.snowflakePassword),
        client?.config.snowflakeDatabase,
        client?.config.snowflakeRole,
        client?.config.snowflakeWarehouse
      );

      const enterpriseList = await snowflakeService.getEnterprises(
        client.clientID
      );
      sendResponse(res, true, CODE.SUCCESS, 'Enterprise List', enterpriseList);
    } else {
      const userRepo = getCustomRepository(UserRepository);
      const userData = await userRepo.getUserDetails({ id: loggedInId });
      const enterpriseList = [];
      for (let index = 0; index < userData.enterprises.length; index++) {
        const enterprise = userData.enterprises[index];
        enterpriseList.push({
          ...enterprise,
          ENTERPRISE_ID: enterprise.enterpriseID,
          ENTERPRISE_NAME: enterprise.enterpriseName,
        });
      }
      sendResponse(res, true, CODE.SUCCESS, 'Enterprise List', enterpriseList);
    }
  } catch (_e) {
    console.log('~ _e', _e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default listEnterprise;
