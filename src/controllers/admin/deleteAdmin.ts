import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/user';
import { UserI } from '../../interface/user/user';
import { CODE } from '../../../config/config';

const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { loggedInId: deletedBy } = res.locals;
    Logger.info(`Delete admin request`);
    //create repo instance
    const userRepo = getCustomRepository(UserRepository);

    const admin: UserI = await userRepo.getAdmin({ id });
    admin.deletedBy = deletedBy;

    //set deleted by data
    await userRepo.updateUser(admin);

    //remove admin from db
    const result = userRepo.removeUser({ id });

    sendResponse(res, true, CODE.SUCCESS, 'Admin deleted successfully', result);
  } catch (_e) {
    Logger.error(_e);
    console.log('~ _e', _e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default deleteAdmin;
