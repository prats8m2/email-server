import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { getCustomRepository, Not } from 'typeorm';
import { UserRepository } from '../../../repository/user';
import {
  VALIDATION,
  ROLES,
  MAX_LENGTH,
  CODE,
} from '../../../../../config/config';
import { UserI } from '../../../interface/user/user';

const updateAdminValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from body
  const { id, username, firstName, lastName, email, password, status } =
    req.body;

  //fetch data from token
  const { loggedInRole } = res.locals;

  //check mandatory fields
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
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid admin email', email);
    return;
  }

  if (typeof status !== 'number' || (status !== 0 && status !== 1)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid admin status', status);
    return;
  }

  if (password && !new RegExp(VALIDATION.password).test(password)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid admin password');
    return false;
  }

  //check for optional fields
  // if (mobile && !new RegExp(VALIDATION.mobile).test(mobile)) {
  //   sendResponse(res, false, CODE.INVALID_KEY, "Invalid admin mobile");
  //   return false;
  // }

  if (lastName && lastName.length > MAX_LENGTH.LAST_NAME) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid admin last name');
    return false;
  }

  //check for existing admin data
  const userRepo = getCustomRepository(UserRepository);

  const adminDataForId: UserI = await userRepo.getAdminWithPass({ id });
  res.locals.existingAdminData = adminDataForId;
  if (!adminDataForId) {
    sendResponse(res, false, CODE.NOT_FOUND, 'Admin not found', id);
  }

  const admin: UserI = await userRepo.getAdmin([
    { username, id: Not(id) },
    { email, id: Not(id) },
  ]);
  // console.log("~ admin", admin);
  if (admin && admin.roles[0]?.name === ROLES.ADMIN) {
    if (admin.username === username) {
      sendResponse(
        res,
        false,
        CODE.INVALID_KEY,
        'Admin name already exist',
        username
      );
    }
    if (admin.email === email) {
      sendResponse(
        res,
        false,
        CODE.INVALID_KEY,
        'Admin email already exist',
        email
      );
    } else {
      sendResponse(
        res,
        false,
        CODE.ALREADY_EXIST,
        'Admin already exist error',
        admin
      );
    }
    return;
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
export default updateAdminValidation;
