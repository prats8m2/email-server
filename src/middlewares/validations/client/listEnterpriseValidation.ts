import { Request, Response, NextFunction } from 'express';

const listEnterpriseValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from token
  // const { loggedInRole } = res.locals;

  // if (loggedInRole !== ROLES.SUPER_ADMIN && loggedInRole !== ROLES.ADMIN) {
  //   sendResponse(
  //     res,
  //     false,
  //     CODE.UNAUTHORIZED,
  //     "Permission denied!",
  //     loggedInRole
  //   );
  //   return;
  // }
  next();
};

export default listEnterpriseValidation;
