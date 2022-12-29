import { Request, Response } from 'express';
import { UserRepository } from '../../repository/user';
import { getCustomRepository } from 'typeorm';
import sendResponse from '../../utility/response';
import Logger from '../../utility/logger';
import { CODE } from '../../../../config/config';
import { UserI } from '../../interface/user/user';

const updateProfile = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { firstName, lastName, email } = req.body;
    Logger.info(`Update profile request`);
    //fetch data from token
    const { loggedInId } = res.locals;

    //create user repo instance
    const userRepo = getCustomRepository(UserRepository);

    if (!firstName || !email) {
      sendResponse(res, false, CODE.INVALID_KEY, 'Invalid data');
      return;
    }

    const userData: UserI = await userRepo.getUser({ id: loggedInId });

    if (!userData) {
      sendResponse(res, false, CODE.NOT_FOUND, 'User not found');
      return;
    }

    userData.firstName = firstName;
    userData.lastName = lastName || null;
    userData.email = email;

    const updatedUser = await userRepo.updateUser(userData);

    Logger.info(`Update profile successfully`);
    //send response
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      'User profile updated successfully',
      updatedUser
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

export default updateProfile;
