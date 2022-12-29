import { Request, Response } from 'express';

import { UserRepository } from '../../repository/user';
import { getCustomRepository } from 'typeorm';
import sendResponse from '../../utility/response';
import { UserI } from '../../interface/user/user';
import { CODE } from '../../../../config/config';
import Logger from '../../utility/logger';

const getProfile = async (req: Request, res: Response) => {
  try {
    const { loggedInId: id } = res.locals;
    Logger.info(`Get profile request`);
    //create repo instance
    const userRepo = getCustomRepository(UserRepository);

    const userData: UserI = await userRepo.getProfile({ id });
    if (userRepo) {
      Logger.info(`Profile data fetched successfully`);
      sendResponse(res, true, CODE.SUCCESS, 'User data', userData);
    } else {
      sendResponse(res, false, CODE.NOT_FOUND, 'User not exist', userData);
    }
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

export default getProfile;
