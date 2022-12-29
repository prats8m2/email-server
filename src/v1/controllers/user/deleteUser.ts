import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/user';
import { UserI } from '../../interface/user/user';
import { CODE } from '../../../../config/config';
import removeRolesFromUser from '../../helpers/user/removeRolesFromUser';
import SnowflakeService from '../../services/snowflake/snowflake';
import DECRYPT from '../../utility/decrypt';

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { loggedInId: deletedBy } = res.locals;
    Logger.info(`Deleting a User`);
    //create repo instance
    const userRepo = getCustomRepository(UserRepository);

    const user: UserI = await userRepo.getUserDetails({ id });
    if (!user) {
      sendResponse(res, false, CODE.NOT_FOUND, 'User not found', user);
      return;
    }

    //remove user from reporting server
    removeRolesFromUser(user);

    user.deletedBy = deletedBy;

    //set deleted by data
    await userRepo.updateUser(user);

    //remove user from db
    const result = userRepo.removeUser({ id });

    const roleData = user.roles[0];
    const client = roleData.client;
    const config = client.config;
    const snowflakeService = new SnowflakeService(
      config.snowflakeAccount,
      config.snowflakeUsername,
      DECRYPT(config.snowflakePassword),
      config.snowflakeDatabase,
      config.snowflakeRole,
      config.snowflakeWarehouse,
      true
    );

    snowflakeService.removeUser(user.id);

    console.log(`User deleted successfully`);
    sendResponse(res, true, CODE.SUCCESS, 'User deleted successfully', result);
  } catch (_e) {
    Logger.error(_e);
    console.log('~ _e', _e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default deleteUser;
