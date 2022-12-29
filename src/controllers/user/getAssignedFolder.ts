import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/user';
import { UserI } from '../../interface/user/user';
import sendResponse from '../../utility/response';
import { CODE } from '../../../config/config';
import DECRYPT from '../../utility/decrypt';
import Logger from '../../utility/logger';

const getAssignedFolder = async (req: Request, res: Response) => {
  const { loggedInId: id } = res.locals;

  Logger.info(`Get assigned folder`);
  const userRepo = getCustomRepository(UserRepository);

  const userData: UserI = await userRepo.getUserDetails({ id });

  if (!userData) {
    sendResponse(res, false, CODE.NOT_FOUND, 'User not found');
    return;
  }

  const site = userData?.roles[0]?.site;
  const accountName = userData?.roles[0]?.accountName;
  const auth = Buffer.from(DECRYPT(userData.authToken)).toString('base64');
  const result = [
    {
      name: 'Web Report',
      url: `${site.url}/webos/app/webstudio/run.jsp?jrs.cmd=jrs.login&jrs.authorization=${auth}`,
    },
    {
      name: 'Page Report',
      url: `${site.url}/dhtmljsp/newreport.jsp?FromServer=true&jrs.catalog=/%3C${accountName}%3E/Self%20Service%20Reports/Self%20Service%20Reporting%20Layer.cat&jrs.cmd=jrs.login&jrs.authorization=${auth}`,
    },
    {
      name: 'Report Library',
      url: `${site.url}/jinfonet/default.jsp?jrs.authorization=${auth}`,
      // url: `${site.url}/jinfonet/getCatRptsNew.jsp?jrs.cmd=jrs.get_subnodes&jrs.path=/%3C${accountName}%3E/USERFOLDERPATH/${userData.username}&jrs.authorization=${auth}`,
    },
  ];
  // const folderName: string[] = [];
  // for (let index = 0; index < userData.roles.length; index++) {
  //   const role = userData.roles[index];
  //   const folders = role.folders;
  //   for (let index = 0; index < folders.length; index++) {
  //     const folder = folders[index];
  //     if (!folderName.includes(folder.name)) {
  //       folderName.push(folder.name);
  //       result.push({
  //         name: folder.name,
  //         // url: `${site.url}/jinfonet/default.jsp?jrs.path=/%3C${role.accountName}%3E/${folder.name}&jrs.authorization=${auth}`,
  //         url: `${site.url}/jinfonet/getCatRptsNew.jsp?jrs.cmd=jrs.get_subnodes&jrs.path=/%3C${role.accountName}%3E/${folder.name}&jrs.authorization=${auth}`,
  //       });
  //     }
  //   }
  // }
  Logger.info(`Assigned folder fetched successfully`);
  sendResponse(res, true, CODE.SUCCESS, 'Assigned folders', result);
};

export default getAssignedFolder;
