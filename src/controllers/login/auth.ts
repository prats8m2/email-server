import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import { createToken } from '../../utility/jwt';
import MD5 from 'md5';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/user';
import { UserI } from '../../interface/user/user';
import { CODE } from '../../../config/config';
import Logger from '../../utility/logger';

const login = async (req: Request, res: Response) => {
  //fetch data from body
  const { account, username, password } = req.body;
  Logger.info(`Login request`);

  //create repo instance for user table
  const userRepo = getCustomRepository(UserRepository);
  let user: UserI;
  if (account === 'UG') {
    user = await userRepo.authenticateAdmin(account, username, MD5(password));
  } else {
    user = await userRepo.authenticate(account, username, MD5(password));
  }
  if (!user) {
    sendResponse(res, false, CODE.INVALID_CRED, 'Invalid credentials');
    return;
  }

  if (!user.roles.length) {
    sendResponse(res, false, CODE.INVALID_CRED, 'Invalid account name');
    return;
  }

  if (!user.status) {
    sendResponse(res, false, CODE.INVALID_CRED, 'User account deactivated');
    return;
  }

  if (account !== 'UG' && user.roles[0] && !user.roles[0].client.status) {
    sendResponse(res, false, CODE.INVALID_CRED, 'Inactive Client');
    return;
  }

  const tokenObject = {
    id: user.id,
    name: `${user.firstName} ${user.lastName ?? ''}`,
    role: account === 'UG' ? user.roles : [user.roles[0]],
    email: user.email,
    username: user.username,
    isFirstLogin: user.isFirstLogin,
    isTempPass: user.isTempPass,
    clientId: user.roles[0]?.client?.id,
  };

  user.lastLogin = Date.now();
  user.isFirstLogin = false;
  await userRepo.updateUser(user);
  const token = createToken(tokenObject);
  Logger.info(`Login successful`);
  sendResponse(res, true, CODE.SUCCESS, `Login Successful`, { token });
};

export default login;
