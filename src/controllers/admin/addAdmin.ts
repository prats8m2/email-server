//library
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import MD5 from 'md5';

//files & function
import { UserRepository } from '../../repository/user';
import sendResponse from '../../utility/response';

//config & interface
import { UserI } from '../../interface/user/user';
import {
  CODE /* USER_TYPE, ADMIN_ENTERPRISE_ID*/,
} from '../../../config/config';
import welcomeEmailToClientAdmin from '../../utility/mail/welcomeEmailToClientAdmin';
import Logger from '../../utility/logger';

/**
 * function to add admin in the system
 *
 * @param  {Request} req
 * @param  {Response} res
 */
const addAdmin = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { firstName, lastName, email, username, password } = req.body;
    Logger.info(`Add admin request`);
    //fetch data from token
    const { loggedInId: createdBy } = res.locals;

    //create admin repo instance
    const userRepo = getCustomRepository(UserRepository);

    //create a admin object
    const admin = {
      ...req.body,
      password: MD5(password),
      isFirstLogin: true,
      createdBy,
    };
    //add new admin in the db

    const newAdmin: UserI = await userRepo.createUser(admin);
    //send welcome email to admin
    welcomeEmailToClientAdmin(
      email,
      `${firstName} ${lastName}`,
      username,
      password
    );

    //send response
    sendResponse(res, true, CODE.SUCCESS, 'Admin added successfully', newAdmin);
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

export default addAdmin;
