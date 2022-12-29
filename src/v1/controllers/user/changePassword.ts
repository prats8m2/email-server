import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import MD5 from 'md5';
import { CODE } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/user';
import Logger from '../../utility/logger';

const changePassword = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { currentPassword, newPassword } = req.body;
    Logger.info(`Change password request`);
    //fetch data from token
    const { loggedInId: id } = res.locals;

    const userRepo = getCustomRepository(UserRepository);
    const userData = await userRepo.getUser({
      id,
      password: MD5(currentPassword),
    });

    if (userData) {
      userData.password = MD5(newPassword);
      userData.updatedBy = id;

      userRepo.updateUser(userData);
      Logger.info(`Password updated successfully`);
      sendResponse(res, true, CODE.SUCCESS, 'Password change successfully');
    } else {
      sendResponse(res, false, 235, 'Invalid current password');
    }
  } catch (_e) {
    const e: Error = _e;

    if (e.message === 'invalid signature') {
      sendResponse(
        res,
        false,
        CODE.INVALID_CRED,
        'Invalid change password token!'
      );
      return false;
    }

    if (e.message === 'jwt expired') {
      sendResponse(res, false, CODE.JWT_EXPIRE, 'Reset password link expired!');
      return false;
    }

    sendResponse(res, false, 414, e.message);
  }
};

export default changePassword;
