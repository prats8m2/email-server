import { Request, Response } from 'express';

import { UserRepository } from '../../repository/user';
import { getCustomRepository } from 'typeorm';
import sendResponse from '../../utility/response';
import Logger from '../../utility/logger';
import { UserI } from '../../interface/user/user';
import { CODE } from '../../../../config/config';

const viewAdmin = async (req: Request, res: Response) => {
  try {
    //get params
    const { id } = req.params;
    Logger.info(`View admin request`);
    //create repo instance
    const adminRepo = getCustomRepository(UserRepository);

    //get data from the db
    const adminData: UserI = await adminRepo.getAdminDetails({ id });
    if (adminRepo) {
      sendResponse(res, true, CODE.SUCCESS, 'Admin data', adminData);
    } else {
      sendResponse(res, false, CODE.NOT_FOUND, 'Admin not exist', adminData);
    }
  } catch (_e) {
    Logger.error(_e);
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

export default viewAdmin;
