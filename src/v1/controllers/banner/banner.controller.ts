import { Request, Response } from 'express';
import addBanner from './addBanner';
import getBanner from './getBanner';

class BannerController {
  public addBanner = async (req: Request, res: Response) => {
    addBanner(req, res);
  };

  public getBanner = async (req: Request, res: Response) => {
    getBanner(req, res);
  };
}

export default BannerController;
