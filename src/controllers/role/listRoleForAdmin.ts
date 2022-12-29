import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { CODE } from '../../../config/config';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';

const listRoleForAdmin = async (req: Request, res: Response) => {
  try {
    //create role repo instance
    const roleRepo = getCustomRepository(RoleRepository);
    Logger.info(`List role for admin request`);
    //get all list of roles
    const [roles, count] = await roleRepo.getAllRoleOfAdmin();
    const result = [];
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index];
      result.push({
        id: role.id,
        name: `${role?.client?.name}`,
      });
    }

    Logger.info(`List role successfully`);
    //send API response
    sendResponse(res, true, CODE.SUCCESS, 'Role List', { count, result });
  } catch (_e) {
    console.log('~ _e', _e);
    Logger.error(_e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default listRoleForAdmin;
