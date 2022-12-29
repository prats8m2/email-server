import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { CODE } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';

const listRole = async (req: Request, res: Response) => {
  try {
    //fetch data from query
    const { clientId, siteId } = req.params;
    Logger.info(`List role request`);
    //create role repo instance
    const roleRepo = getCustomRepository(RoleRepository);

    //get all list of roles
    const [list, count] = await roleRepo.getAllRole(
      clientId.toString(),
      siteId.toString()
    );

    Logger.info(`Role list successfully`);
    //send API response
    sendResponse(res, true, CODE.SUCCESS, 'Role List', { count, list });
  } catch (_e) {
    console.log('~ _e', _e);
    Logger.error(_e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default listRole;
