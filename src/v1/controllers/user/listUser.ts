import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { MAX_ROW, CODE } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/user';

const listUser = async (req: Request, res: Response) => {
  try {
    //fetch data from query
    const { row = MAX_ROW, page = 1, client, site } = req.query;
    Logger.info(`List user request`);
    //create user repo instance
    const userRepo = getCustomRepository(UserRepository);

    //get all list of users
    const [list, count] = await userRepo.getAllUser(
      parseInt(row.toString()),
      parseInt(page.toString()),
      client.toString(),
      site.toString()
    );

    Logger.info(`User list sent successfully`);
    //send API response
    sendResponse(res, true, CODE.SUCCESS, 'User List', { count, list });
  } catch (_e) {
    Logger.error(_e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred'); //send the response to the client
  }
};

export default listUser;
