import { VALIDATION, ROLES, MAX_LENGTH, CODE } from '../../../../config/config';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { getCustomRepository, Not } from 'typeorm';
import { SiteRepository } from '../../../repository/site';

const updateSiteValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from body
  const { id, name, ip, port, username, type, status } = req.body;

  //fetch data from token
  const { loggedInRole } = res.locals;

  //check for data VALIDATION
  if (!id || !new RegExp(VALIDATION.uuid).test(id)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid site ID', id);
    return;
  }

  if (!name || name.length > MAX_LENGTH.SITE_NAME) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid site name', name);
    return;
  }

  if (!ip || ip.length > MAX_LENGTH.IP) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid site ip', ip);
    return;
  }

  if (typeof port !== 'number') {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid site port', port);
    return;
  }

  if (!username || username.length > MAX_LENGTH.USERNAME) {
    sendResponse(
      res,
      false,
      CODE.INVALID_KEY,
      'Invalid site username',
      username
    );
    return;
  }

  // if (!password || password.length > MAX_LENGTH.PASSWORD) {
  //   sendResponse(
  //     res,
  //     false,
  //     CODE.INVALID_KEY,
  //     "Invalid site password",
  //     password
  //   );
  //   return;
  // }

  if (typeof type !== 'number' || (type !== 1 && type !== 2)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid site type', type);
    return;
  }

  if (typeof status !== 'number' || (status !== 0 && status !== 1)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid site status', status);
    return;
  }

  //check if name already exist
  const siteRepo = getCustomRepository(SiteRepository);

  const siteDataForId = await siteRepo.getSite({ id });
  res.locals.oldSiteData = siteDataForId;
  if (!siteDataForId) {
    sendResponse(res, false, CODE.NOT_FOUND, 'Site not found', id);
  }

  const siteResult = await siteRepo.getSite({ name, id: Not(id) });
  if (siteResult) {
    sendResponse(
      res,
      false,
      CODE.ALREADY_EXIST,
      'Site already exist',
      siteResult
    );
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

export default updateSiteValidation;
