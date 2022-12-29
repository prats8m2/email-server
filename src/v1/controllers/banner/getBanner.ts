import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { CODE } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { BannerRepository } from '../../repository/banner';

const getBanner = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { client } = req.params;
    Logger.info(`Get banner request`);
    const bannerRepo = getCustomRepository(BannerRepository);

    const result = await bannerRepo.getBanner({ client });
    //send response
    sendResponse(res, true, CODE.SUCCESS, 'Banner data', result);
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

export default getBanner;
