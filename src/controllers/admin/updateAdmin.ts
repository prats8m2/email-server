import { Request, Response } from 'express';
import { UserRepository } from '../../repository/user';
import { getCustomRepository } from 'typeorm';
import sendResponse from '../../utility/response';
import Logger from '../../utility/logger';
import MD5 from 'md5';
import { CODE } from '../../../config/config';
// import updateAdminOnWarehouse from "../../helpers/user/updateAdminOnWarehouse";

const updateAdmin = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { password } = req.body;
    Logger.info(`Update admin request`);
    //fetch data from token
    const { loggedInId: updatedBy, existingAdminData } = res.locals;

    //create admin repo instance
    const userRepo = getCustomRepository(UserRepository);

    //create a admin object
    const admin = {
      ...req.body,
      password: password ? MD5(password) : existingAdminData.password,
      updatedBy,
    };
    //update new admin in the db
    const updatedAdmin = await userRepo.updateUser(admin);

    // updateAdminOnWarehouse(existingAdminData, roles);

    //send response
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      'Admin updated successfully',
      updatedAdmin
    );
  } catch (_e) {
    console.log('~ _e', _e);
    Logger.error(_e);
    sendResponse(
      res,
      false,
      CODE.SERVER_ERROR,
      'Some error occurred',
      _e.message
    );
  }
};

export default updateAdmin;
