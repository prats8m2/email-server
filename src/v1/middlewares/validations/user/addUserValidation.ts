import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../../repository/user';
import {
  VALIDATION,
  MAX_LENGTH,
  CODE,
  ROLES,
} from '../../../../../config/config';
import { UserI } from '../../../interface/user/user';
import { ClientRepository } from '../../../repository/client';
import { ClientI } from '../../../interface/client/client';

const addUserValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from body
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    status,
    roles,
    client,
  } = req.body;

  const { loggedInRole } = res.locals;

  //check mandatory fields
  if (!username || username.length > MAX_LENGTH.USERNAME) {
    sendResponse(
      res,
      false,
      CODE.INVALID_KEY,
      'Invalid user username',
      username
    );
    return;
  }

  if (!roles || !roles.length) {
    sendResponse(
      res,
      false,
      CODE.INVALID_KEY,
      'Please assign some role to user',
      username
    );
    return;
  }

  if (!firstName || firstName.length > MAX_LENGTH.FIRST_NAME) {
    sendResponse(
      res,
      false,
      CODE.INVALID_KEY,
      'Invalid user first name',
      firstName
    );
    return;
  }

  if (
    !email ||
    !new RegExp(VALIDATION.email).test(email) ||
    email.length > MAX_LENGTH.EMAIL
  ) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid user email', email);
    return;
  }

  if (typeof status !== 'number' || (status !== 0 && status !== 1)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid user status', status);
    return;
  }

  //check for optional fields
  // if (mobile && !new RegExp(VALIDATION.mobile).test(mobile)) {
  //   sendResponse(res, false, CODE.INVALID_KEY, "Invalid user mobile");
  //   return false;
  // }

  if (lastName && lastName.length > MAX_LENGTH.LAST_NAME) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid user last name');
    return false;
  }

  if (!password || !new RegExp(VALIDATION.password).test(password)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid user password');
    return false;
  }

  const clientRepo = getCustomRepository(ClientRepository);
  const clientData: ClientI = await clientRepo.getClient({ id: client });
  if (!clientData) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client details');
    return false;
  }
  const accountName = clientData.name;
  //check for existing user data
  const userRepo = getCustomRepository(UserRepository);
  const user: UserI = await userRepo.getUserDetails([{ email }, { username }]);
  if (user) {
    if (user.email === email && user.roles[0].accountName === accountName) {
      sendResponse(
        res,
        false,
        CODE.INVALID_KEY,
        'User email already exist',
        email
      );
      return;
    }
    if (
      user.username === username &&
      user.roles[0].accountName === accountName
    ) {
      sendResponse(
        res,
        false,
        CODE.INVALID_KEY,
        'User name already exist',
        email
      );
      return;
    }
  }

  if (loggedInRole !== ROLES.SUPER_ADMIN && loggedInRole !== ROLES.ADMIN) {
    sendResponse(
      res,
      false,
      CODE.UNAUTHORIZED,
      'Permission denied!',
      loggedInRole
    );
    return;
  }

  next();
};
export default addUserValidation;
