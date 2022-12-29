import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { CODE } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { BannerRepository } from '../../repository/banner';

const addBanner = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { title, message, type, status, launchDate, client, expirationDate } =
      req.body;
    Logger.info(`Add banner request`);
    //fetch data from token
    const { loggedInId: updatedBy } = res.locals;

    const bannerRepo = getCustomRepository(BannerRepository);
    const banner = {
      title,
      message,
      type,
      status,
      launchDate,
      client,
      expirationDate,
      updatedBy: updatedBy,
    };

    const result = await bannerRepo.updateBanner(banner);

    //send response
    sendResponse(res, true, CODE.SUCCESS, 'Banner added successfully', result);
  } catch (_e) {
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

export default addBanner;
