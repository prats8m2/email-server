import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import { getCustomRepository } from 'typeorm';
import { SiteRepository } from '../../repository/site';
import sendResponse from '../../utility/response';
import { SiteI } from '../../interface/site/site';
import { CODE } from '../../../config/config';
import ENCRYPT from '../../utility/encrypt';

const addSite = async (req: Request, res: Response) => {
  try {
    const { password, name } = req.body;
    //fetch data from token
    const { loggedInId: createdBy } = res.locals;
    Logger.info(`Adding a site: ${name}`);

    //create site repo instance
    const siteRepo = getCustomRepository(SiteRepository);

    //create a site object
    const site = {
      ...req.body,
      password: ENCRYPT(password),
      createdBy,
    };
    //add new site in the db
    const newSite: SiteI = await siteRepo.createSite(site);

    Logger.info(`Site added successfully`);
    //send response
    sendResponse(res, true, CODE.SUCCESS, 'Site added successfully', newSite);
  } catch (_e) {
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

export default addSite;
