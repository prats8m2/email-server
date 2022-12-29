import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { MAX_ROW, CODE } from '../../../config/config';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/user';

const listAdmin = async (req: Request, res: Response) => {
  try {
    //fetch data from query
    const { row = MAX_ROW, page = 1 } = req.query;
    Logger.info(`List admin request`);
    //create admin repo instance
    const userRepo = getCustomRepository(UserRepository);

    //get all list of admins
    const [list, count] = await userRepo.getAllAdmin(row, page);

    //send API response
    sendResponse(res, true, CODE.SUCCESS, 'Admin List', { count, list });
  } catch (_e) {
    Logger.error(_e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default listAdmin;
