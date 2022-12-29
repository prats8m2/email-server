import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { CODE, ROLES } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { SiteRepository } from '../../repository/site';
import { SiteI } from '../../interface/site/site';
import { UserRepository } from '../../repository/user';
import DECRYPT from '../../utility/decrypt';

const listReport = async (req: Request, res: Response) => {
  try {
    //fetch data from token
    const { loggedInId: id, loggedInRole: role } = res.locals;
    Logger.info(`Fetch list of reports`);

    //create site repo instance
    const siteRepo = getCustomRepository(SiteRepository);

    let sites: SiteI[] = [];
    let count = 0;
    const list: any[] = [];
    if (role === ROLES.SUPER_ADMIN) {
      //get all list of sites
      [sites, count] = await siteRepo.getAllReportForSuperAdmin();
      for (let index = 0; index < sites.length; index++) {
        const site = sites[index];
        const auth = Buffer.from(
          `${site.username}:${DECRYPT(site.password)}`
        ).toString('base64');
        list.push({
          id: sites[index].id,
          clientName: '',
          siteName: sites[index].name,
          url: `${site.url}/jinfonet/launchpad.jsp?jrs.cmd=jrs.login&jrs.authorization=${auth}`,
        });
      }
    } else if (role === ROLES.ADMIN) {
      //get all list of sites
      [sites, count] = await siteRepo.getAllReportsByUser(id);
      for (let index = 0; index < count; index++) {
        const roles = sites[index].roles;
        const site = sites[index];
        for (let idx = 0; idx < roles.length; idx++) {
          const client = roles[idx].client;
          if (client) {
            const auth = Buffer.from(
              `${client.name}\\${site.username}:${DECRYPT(site.password)}`
            ).toString('base64');
            list.push({
              id: sites[index].id,
              clientName: client.name,
              siteName: sites[index].name,
              url: `${site.url}/jinfonet/launchpad.jsp?jrs.cmd=jrs.login&jrs.authorization=${auth}`,
            });
          }
        }
      }
    } else {
      const userRepo = getCustomRepository(UserRepository);
      const user = await userRepo.getUser({ id });
      //get all list of sites
      [sites, count] = await siteRepo.getAllReportsByUser(id);
      for (let index = 0; index < count; index++) {
        const roles = sites[index].roles;
        const site = sites[index];
        const client = roles[0].client; // FIX: for dashboard server
        const auth = Buffer.from(`${DECRYPT(user.authToken)}`).toString(
          'base64'
        );
        list.push({
          id: sites[index].id,
          clientName: client.name,
          siteName: sites[index].name,
          url: `${site.url}/jrserver?jrs.cmd=jrs.get_subnodes&jrs.path=/<${client.name}>/&jrs.authorization=${auth}`,
        });
      }
    }

    Logger.info(`Report list fetched successfully`);
    //send API response
    sendResponse(res, true, CODE.SUCCESS, 'Site List', {
      count: list.length,
      list,
    });
  } catch (_e) {
    console.log('~ _e', _e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default listReport;
