//library
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import MD5 from 'md5';

//files & function
import { UserRepository } from '../../repository/user';
import sendResponse from '../../utility/response';

//config & interface
import { UserI } from '../../interface/user/user';
import { CODE, ROLES } from '../../../config/config';
import { RoleRepository } from '../../repository/role';
import Logger from '../../utility/logger';

/**
 * function to add admin in the system
 *
 * @param  {Request} req
 * @param  {Response} res
 */
const addSuperAdmin = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { password } = req.body;
    Logger.info(`Add Super admin request`);

    //create admin repo instance
    const userRepo = getCustomRepository(UserRepository);
    const roleRepo = getCustomRepository(RoleRepository);
    const role = await roleRepo.getRole({ name: ROLES.SUPER_ADMIN });

    //create a admin object
    const admin: UserI = {
      ...req.body,
      password: MD5(password),
      isFirstLogin: true,
      roles: [role],
    };
    //add new admin in the db
    const newAdmin: UserI = await userRepo.createUser(admin);

    //send response
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      ' Super Admin added successfully',
      newAdmin
    );
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

export default addSuperAdmin;
