import { Request, Response } from 'express';

import { SiteRepository } from '../../repository/site';
import { getCustomRepository } from 'typeorm';
import sendResponse from '../../utility/response';
import Logger from '../../utility/logger';
import { SiteI } from '../../interface/site/site';
import { CODE } from '../../../config/config';

const getSite = async (req: Request, res: Response) => {
  try {
    //get params
    const { id } = req.params;
    Logger.info(`Fetching site details`);

    //create repo instance
    const siteRepo = getCustomRepository(SiteRepository);

    //get data from the db
    const siteData: SiteI = await siteRepo.getSiteDetails({ id });
    if (siteRepo) {
      Logger.info(`Site data fetched`);
      sendResponse(res, true, CODE.SUCCESS, 'Site data', siteData);
    } else {
      sendResponse(res, false, CODE.NOT_FOUND, 'Site not exist', siteData);
    }
  } catch (_e) {
    Logger.error(_e);
    console.log('~ _e', _e);
    sendResponse(
      res,
      false,
      CODE.SERVER_ERROR,
      'Some error occurred',
      _e.message
    );
  }
};

export default getSite;
