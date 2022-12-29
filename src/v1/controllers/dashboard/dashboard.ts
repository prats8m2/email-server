import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import SnowflakeService from '../../services/snowflake/snowflake';
import sendResponse from '../../utility/response';
import { CODE, STATUS } from '../../../../config/config';
import { BannerRepository } from '../../repository/banner';
import { findDashMax, findDashMin } from '../../utility/minMax';
import { getLastETL } from '../../services/medra/getLastETL';
import DECRYPT from '../../utility/decrypt';
import Logger from '../../utility/logger';

const dashboard = async (req: Request, res: Response) => {
  Logger.info(`Dashboard data request`);
  const { enterpriseId, duration, clientId } = req.body;
  //get client data
  const clientRepo = getCustomRepository(ClientRepository);
  const bannerRepo = getCustomRepository(BannerRepository);
  const client = await clientRepo.getClientDetails({ id: clientId });
  if (
    !client ||
    !client.config ||
    !client.config.snowflakeUsername ||
    !client.config.medraPass
  ) {
    sendResponse(res, false, CODE.NOT_FOUND, 'Client config not found');
    return;
  }

  //fetch banner info
  const response: any[] = [];
  const bannerInfo = await bannerRepo.getBanner({ client });
  if (
    bannerInfo &&
    bannerInfo.status === STATUS.ACTIVE &&
    Date.now() >= bannerInfo.launchDate &&
    Date.now() <= bannerInfo.expirationDate
  ) {
    response.push({
      type: 'banner',
      data: bannerInfo,
    });
  } else {
    response.push({
      type: 'banner',
      data: null,
    });
  }
  const snowflakeService = new SnowflakeService(
    client?.config.snowflakeAccount,
    client?.config.snowflakeUsername,
    DECRYPT(client?.config.snowflakePassword),
    client?.config.snowflakeDatabase,
    client?.config.snowflakeRole,
    client?.config.snowflakeWarehouse
  );

  await Promise.allSettled([
    // snowflakeService.caseCountByCurrentWorkflow(enterpriseId),
    snowflakeService.caseCountByReportType(enterpriseId),
    snowflakeService.caseVolumeByTime(enterpriseId, duration),
    snowflakeService.topPTcounts(enterpriseId),
    snowflakeService.countOfSubmission(enterpriseId),
    snowflakeService.totalCaseCount(enterpriseId),
    getLastETL(
      client?.config.medraHost,
      client?.config.medraPort,
      client?.config.medraDBName,
      client?.config.medraUsername,
      DECRYPT(client?.config.medraPass)
    ),
  ])
    .then(async (resp: any) => {
      const result: any[] = [
        {
          type: 'Case count by report type',
          data: resp[0].value,
          max: findDashMax(resp[0].value, 'COUNT(DISTINCT UCI.CASE_ID)'),
          min: findDashMin(resp[0].value, 'COUNT(DISTINCT UCI.CASE_ID)'),
        },
        {
          type: 'Case volume by time',
          data: resp[1].value,
          max: findDashMax(resp[1].value, 'CASE_COUNT'),
          min: findDashMin(resp[1].value, 'CASE_COUNT'),
        },
        {
          type: 'Top PT counts',
          data: resp[2].value,
          max: findDashMax(resp[2].value, 'EVT_CNT'),
          min: findDashMin(resp[2].value, 'EVT_CNT'),
        },
        {
          type: 'Count of submission',
          data: resp[3].value,
          max: findDashMax(resp[3].value, 'SUBM_CNT'),
          min: findDashMin(resp[3].value, 'SUBM_CNT'),
        },
        {
          type: 'Total case count',
          data: resp[4]?.value[0]?.TOTAL,
        },
        {
          type: 'Last ETL run',
          data: resp[5]?.value[0]?.max,
        },
      ];

      response.push(...result);
      Logger.info(`Dashboard data send successfully`);
      sendResponse(res, true, CODE.SUCCESS, 'Data', response);
    })
    .catch((err: any) => {
      console.log('Err Resp', err);
    });
};
export default dashboard;
