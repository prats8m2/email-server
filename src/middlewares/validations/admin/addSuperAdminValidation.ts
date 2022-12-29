import { VALIDATION, MAX_LENGTH, CODE, ROLES } from '../../../../config/config';
import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../utility/response';
import { UserI } from '../../../interface/user/user';
import { UserRepository } from '../../../repository/user';
import { getCustomRepository } from 'typeorm';

const addSuperAdminValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, firstName, lastName, email, password, status } = req.body;
  const { loggedInRole } = res.locals;
  if (!username || username.length > MAX_LENGTH.USERNAME) {
    sendResponse(
      res,
      false,
      CODE.INVALID_KEY,
      'Invalid admin username',
      username
    );
    return;
  }

  if (!firstName || firstName.length > MAX_LENGTH.FIRST_NAME) {
    sendResponse(
      res,
      false,
      CODE.INVALID_KEY,
      'Invalid admin first name',
      firstName
    );
    return;
  }

  if (
    !email ||
    !new RegExp(VALIDATION.email).test(email) ||
    email.length > MAX_LENGTH.EMAIL
  ) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid email', email);
    return;
  }

  if (typeof status !== 'number' || (status !== 0 && status !== 1)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid status', status);
    return;
  }

  if (lastName && lastName.length > MAX_LENGTH.LAST_NAME) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid last name');
    return false;
  }

  if (!password || !new RegExp(VALIDATION.password).test(password)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid password');
    return false;
  }
  const userRepo = getCustomRepository(UserRepository);
  const admin: UserI = await userRepo.getSuperAdmin([{ username }, { email }]);
  if (admin?.roles[0]?.name === ROLES.SUPER_ADMIN) {
    if (admin.username === username) {
      sendResponse(
        res,
        false,
        CODE.INVALID_KEY,
        'Super admin user name already exist',
        username
      );
      return;
    }
    if (admin.email === email) {
      sendResponse(
        res,
        false,
        CODE.INVALID_KEY,
        'Super admin email already exist',
        email
      );
      return;
    } else {
      sendResponse(
        res,
        false,
        CODE.ALREADY_EXIST,
        'Super admin already exist',
        admin
      );
      return;
    }
  }

  if (loggedInRole !== ROLES.SUPER_ADMIN) {
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

export default addSuperAdminValidation;
