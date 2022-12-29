import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import MD5 from 'md5';
import { CODE } from '../../../config/config';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/user';
import Logger from '../../utility/logger';

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { otp, id, password } = req.body;
    Logger.info(`Reset password request`);

    const userRepo = getCustomRepository(UserRepository);
    // const user = new User();
    const userData = await userRepo.getAdmin({ id, token: otp });

    if (userData) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (userData.tokenExpiration > currentTime) {
        userRepo.updatePassword(MD5(password), id, id);
        sendResponse(res, true, CODE.SUCCESS, 'Password reset successfully');
      } else {
        sendResponse(res, false, 235, 'OTP Expired');
      }
    } else {
      sendResponse(res, false, 235, 'Invalid OTP');
    }
  } catch (_e) {
    const e: Error = _e;

    if (e.message === 'invalid signature') {
      sendResponse(
        res,
        false,
        CODE.INVALID_CRED,
        'Invalid reset password token!'
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

export default resetPassword;
