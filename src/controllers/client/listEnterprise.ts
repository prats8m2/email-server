import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import { CODE, ROLES } from '../../../config/config';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import { getEnterprise } from '../../services/postgres/getEnterprise';
import Logger from '../../utility/logger';
import { UserRepository } from '../../repository/user';
import getDataWareHouseConnection from '../../utility/getWarehouseConnection';
import DECRYPT from '../../v1/utility/decrypt';
import SnowflakeService from '../../services/snowflake/snowflake';
import CAPITALIZEKEYS from '../../utility/capitalizeKeys';

const listEnterprise = async (req: Request, res: Response) => {
  try {
    const { clientId: id } = req.params;
    Logger.info(`List enterprise request`);
    const { loggedInId, loggedInRole } = res.locals;
    console.log('loggedInRole: ', loggedInRole);
    let enterpriseList: any = [];
    console.log('ROLES.SUPER_ADMIN: ', ROLES.SUPER_ADMIN);
    console.log('ROLES.ADMIN: ', ROLES.ADMIN);
    console.log('loggedInRole: ', loggedInRole);

    if (loggedInRole === ROLES.ADMIN || loggedInRole === ROLES.SUPER_ADMIN) {
      console.log('ROLES.SUPER_ADMIN: ', ROLES.SUPER_ADMIN);
      console.log('ROLES.ADMIN: ', ROLES.ADMIN);
      console.log('loggedInRole: ', loggedInRole);
      //fetch client config details
      const clientRepo = getCustomRepository(ClientRepository);
      const client = await clientRepo.getClientDetails({ id });
      const pgConnectionDetails = getDataWareHouseConnection(client?.config);
      //check if postgres data is present
      if (pgConnectionDetails !== null && pgConnectionDetails !== false) {
        enterpriseList = await getEnterprise(
          pgConnectionDetails.host,
          pgConnectionDetails.database,
          pgConnectionDetails.username,
          pgConnectionDetails.password,
          client.clientID
        );
        if (!enterpriseList && !enterpriseList.length) {
          // add check for successful connection with AWS
          sendResponse(
            res,
            false,
            CODE.INVALID_SNOWFLAKE_CREDS,
            'Please check postgres connection'
          );
        } else {
          sendResponse(
            res,
            true,
            CODE.SUCCESS,
            'Enterprise List',
            CAPITALIZEKEYS(enterpriseList)
          );
        }
      } else if (
        pgConnectionDetails !== null &&
        pgConnectionDetails === false
      ) {
        console.log(client.config);
        const snowflakeService = new SnowflakeService(
          client?.config.snowflakeAccount,
          client?.config.snowflakeUsername,
          DECRYPT(client?.config.snowflakePassword),
          client?.config.snowflakeDatabase,
          client?.config.snowflakeRole,
          client?.config.snowflakeWarehouse
        );

        enterpriseList = await snowflakeService.getEnterprises(client.clientID);
        if (!enterpriseList && !enterpriseList.length) {
          // add check for successful connection with AWS
          sendResponse(
            res,
            false,
            CODE.INVALID_SNOWFLAKE_CREDS,
            'Please check postgres connection'
          );
        } else {
          sendResponse(
            res,
            true,
            CODE.SUCCESS,
            'Enterprise List',
            enterpriseList
          );
        }
      } else {
        sendResponse(
          res,
          false,
          CODE.INVALID_DATA_WAREHOUSE_CREDS,
          'Data warehouse configurations are not set.'
        );
      }
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
