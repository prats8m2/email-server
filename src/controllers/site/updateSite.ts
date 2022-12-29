import { Request, Response } from 'express';
import { SiteRepository } from '../../repository/site';
import { getCustomRepository } from 'typeorm';
import sendResponse from '../../utility/response';
import Logger from '../../utility/logger';
import { CODE } from '../../../config/config';
import MD5 from 'md5';

const updateSite = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    Logger.info(`Update the site`);
    //fetch data from token
    const { loggedInId: updatedBy, oldSiteData } = res.locals;
    //create site repo instance
    const siteRepo = getCustomRepository(SiteRepository);
    //create a site object
    const site: any = {
      ...req.body,
      password: password ? MD5(password) : oldSiteData.password,
      updatedBy,
    };
    //update new site in the db
    const updatedSite = await siteRepo.updateSite(site);
    Logger.info(`Site updated successfully`);
    //send response
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      'Site updated successfully',
      updatedSite
    );
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

export default updateSite;
