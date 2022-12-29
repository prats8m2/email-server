import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { getCustomRepository } from 'typeorm';
import { SiteRepository } from '../../repository/site';
import { SiteI } from '../../interface/site/site';
import { CODE } from '../../../../config/config';

const deleteSite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { loggedInId: deletedBy } = res.locals;
    Logger.info(`Deleting a site`);
    //create repo instance
    const siteRepo = getCustomRepository(SiteRepository);

    const site: SiteI = await siteRepo.getSiteDetails({ id });

    if (site.clients.length) {
      sendResponse(res, false, CODE.DENIED, 'Already in use');
      return;
    }
    site.deletedBy = deletedBy;

    //set deleted by data
    await siteRepo.updateSite(site);

    //remove site from db
    const result = siteRepo.removeSite({ id });
    Logger.info(`Site delete successfully`);

    sendResponse(res, true, CODE.SUCCESS, 'Site deleted successfully', result);
  } catch (_e) {
    console.log('~ _e', _e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default deleteSite;
