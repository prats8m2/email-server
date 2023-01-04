import { Request, Response } from 'express';
import sendResponse from '../utility/response';
import { CODE } from '../../config/config';
import contactUsMail from '../utility/mail/contactUs';

const contactUs = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, message, org } = req.body;
    contactUsMail(name, email, mobile, message, org);
    sendResponse(res, true, CODE.SUCCESS, 'Email Sent Successfully', email);
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

export default contactUs;
