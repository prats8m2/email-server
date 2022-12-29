import { Request, Response } from 'express';
import sendResponse from '../../utility/response';
import { generateResetPassLink } from '../../utility/jwt';
import resetPassEmail from '../../utility/mail/resetPassEmail';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/user';
import { UserI } from '../../interface/user/user';
import { CODE, RESET_PASS_EXPIRE_TIME } from '../../../../config/config';
import Logger from '../../utility/logger';

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { account, username, email } = req.body;
    Logger.info(`Forgot password request`);
    const userRepo = getCustomRepository(UserRepository);
    const userData: UserI = await userRepo.ifUserExist(
      account,
      username,
      email
    );

    if (!userData) {
      sendResponse(res, false, CODE.INVALID_CRED, 'User not found');
      return;
    }

    if (!userData.roles.length) {
      sendResponse(res, false, CODE.INVALID_CRED, 'User not found');
      return;
    }

    if (userData) {
      // const resetPassLink: string = generateResetPassLink(userData.id);
      const resetPassOTP = generateResetPassLink();

      userData.token = resetPassOTP;
      userData.tokenExpiration =
        Math.floor(Date.now() / 1000) + 60 * RESET_PASS_EXPIRE_TIME;
      userRepo.updateUser(userData);
      resetPassEmail(email, resetPassOTP)
        ? sendResponse(res, true, CODE.SUCCESS, `Email Sent Successfully`, {
            id: userData.id,
          })
        : sendResponse(res, false, CODE.EMAIL_SERVER_DOWN, `Email server down`);
    } else {
      sendResponse(res, true, CODE.NOT_FOUND, `Email not exist`);
    }
  } catch (_e) {
    console.log('~ _e', _e);
    sendResponse(
      res,
      false,
      CODE.SERVER_ERROR,
      'Server error occurred',
      _e.message
    );
  }
};

export default forgotPassword;
