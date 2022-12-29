import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { MAX_ROW, CODE } from '../../../config/config';
import { getCustomRepository } from 'typeorm';
import { SiteRepository } from '../../repository/site';
import { SiteI } from '../../interface/site/site';
import DECRYPT from '../../utility/decrypt';

const listSite = async (req: Request, res: Response) => {
  try {
    //fetch data from query
    const { row = MAX_ROW, page = 1 } = req.query;
    Logger.info(`Fetch site list`);

    //create site repo instance
    const siteRepo = getCustomRepository(SiteRepository);

    // let sites: SiteI[] = [];
    let count = 0;
    let list: SiteI[] | any = [];
    [list, count] = await siteRepo.getAllSite(row, page);
    for (let index = 0; index < list.length; index++) {
      const site = list[index];
      const auth = Buffer.from(
        `${site.username}:${DECRYPT(site.password)}`
      ).toString('base64');

      site.url = `${site.url}/admin/security/newOrganization.jsp?jrs.cmd=jrs.login&jrs.authorization=${auth}`;
    }

    Logger.info(`Site list fetched successfully`);
    //send API response
    sendResponse(res, true, CODE.SUCCESS, 'Site List', { count, list });
  } catch (_e) {
    console.log('~ _e', _e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default listSite;
