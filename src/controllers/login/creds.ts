import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/user';
import { UserI } from '../../interface/user/user';
import { CODE, ROLES } from '../../../config/config';
import DECRYPT from '../../utility/decrypt';
import Logger from '../../utility/logger';

const Creds = async (req: Request, res: Response) => {
  try {
    const { loggedInId: id } = res.locals;
    const userRepo = getCustomRepository(UserRepository);
    const userData: UserI = await userRepo.getUser({ id });
    Logger.info(`Fetch creds request`);

    let auth;
    let response;
    if (userData.roles[0].name === ROLES.SUPER_ADMIN) {
      response = {
        login: ``,
        logout: ``,
      };
    }
    if (userData.roles[0].name === ROLES.ADMIN) {
      const userData: UserI = await userRepo.getAdminDetails({ id });
      auth = `${userData.roles[0].adminUsername}:${DECRYPT(
        userData.roles[0].adminPassword
      )}`;
      response = {
        login: `${
          userData.roles[0]?.site?.url
        }/jrserver?jrs.cmd=jrs.login&jrs.authorization=${Buffer.from(
          userData.roles[0].client.name + '\\' + auth
        ).toString('base64')}`,
        logout: `${userData.roles[0]?.site?.url}/jrserver?jrs.cmd=jrs.logout`,
      };
    }
    if (
      userData.roles[0].name !== ROLES.SUPER_ADMIN &&
      userData.roles[0].name !== ROLES.ADMIN
    ) {
      const userData: UserI = await userRepo.getUserDetails({ id });

      auth = DECRYPT(userData.authToken);
      response = {
        login: `${
          userData.roles[0]?.site?.url
        }/jrserver?jrs.cmd=jrs.login&jrs.authorization=${Buffer.from(
          auth
        ).toString('base64')}`,
        logout: `${userData.roles[0]?.site?.url}/jrserver?jrs.cmd=jrs.logout`,
      };
    }

    Logger.info(`Creds data fetched successfully`);
    sendResponse(res, true, CODE.SUCCESS, `Login URLs`, response);
  } catch (_e) {
    console.log('~ _e', _e);
    sendResponse(
      res,
      false,
      CODE.SERVER_ERROR,
      'Server error occurred',
      _e.message
    );
  }
};

export default Creds;
