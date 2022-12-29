import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { CODE } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';

const listFolder = async (req: Request, res: Response) => {
  try {
    //fetch data from query
    Logger.info(`List folder request`);
    //create role repo instance
    const roleRepo = getCustomRepository(RoleRepository);

    //get all list of roles
    const list = await roleRepo.getAllFolder();

    Logger.info(`Folder list sent successfully`);
    //send API response
    sendResponse(res, true, CODE.SUCCESS, 'Folder List', {
      count: list.length,
      list,
    });
  } catch (_e) {
    console.log('~ _e', _e);
    Logger.error(_e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default listFolder;
