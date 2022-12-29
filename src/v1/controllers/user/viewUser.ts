import { Request, Response } from 'express';

import { UserRepository } from '../../repository/user';
import { getCustomRepository } from 'typeorm';
import sendResponse from '../../utility/response';
import { UserI } from '../../interface/user/user';
import { CODE } from '../../../../config/config';
import Logger from '../../utility/logger';

const viewUser = async (req: Request, res: Response) => {
  try {
    //get params
    const { id } = req.params;
    Logger.info(`View user request`);

    //create repo instance
    const userRepo = getCustomRepository(UserRepository);

    //get data from the db
    const userData: UserI = await userRepo.getUserDetails({ id });
    console.log('~ userData', userData);
    if (userData) {
      Logger.info(`View user successfully`);
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

export default viewUser;
