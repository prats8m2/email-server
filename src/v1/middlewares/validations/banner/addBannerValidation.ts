import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { MAX_LENGTH, CODE } from '../../../../../config/config';

const addBannerValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from body
  const { title, message, type, status, launchDate } = req.body;

  if (!title || title.length > MAX_LENGTH.BANNER_TITLE) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid banner title');
    return false;
  }

  if (!message || message.length > MAX_LENGTH.BANNER_MSG) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid banner message');
    return false;
  }

  if (!type) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid type');
    return false;
  }

  if (!status) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid status');
    return false;
  }

  if (!launchDate) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid launch date');
    return false;
  }

  next();
};

export default addBannerValidation;
