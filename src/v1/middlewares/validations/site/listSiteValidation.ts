import { Request, Response, NextFunction } from 'express';

const listSiteValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};

export default listSiteValidation;
