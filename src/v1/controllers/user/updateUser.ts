import { Request, Response } from 'express';
import { UserRepository } from '../../repository/user';
import { getCustomRepository } from 'typeorm';
import sendResponse from '../../utility/response';
import Logger from '../../utility/logger';
import MD5 from 'md5';
import { CODE } from '../../../../config/config';
import updateUserOnReport from '../../helpers/user/updateUserOnReport';
import filterNewRoles from '../../helpers/user/filterNewRoles';
import updateUserOnSnowflake from '../../helpers/user/updateUserOnSnowflke';
import { UserI } from '../../interface/user/user';

const updateUser = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { password, roles, client, enterprises } = req.body;
    Logger.info(`Update user request`);
    //fetch data from token
    const { loggedInId: updatedBy, oldUserData } = res.locals;

    const { newRolesToAdd, oldRolesToRemove } = await filterNewRoles(
      oldUserData,
      roles
    );

    //create user repo instance
    const userRepo = getCustomRepository(UserRepository);

    //create a user object
    const user: UserI = {
      ...req.body,
      password: password ? MD5(password) : oldUserData.password,
      updatedBy,
    };

    // user.enterprises = oldUserData?.enterprises;
    //update new user in the db
    const updatedUser = await userRepo.updateUser(user);

    //update user on reporting server
    await updateUserOnReport(
      roles,
      user,
      client,
      newRolesToAdd,
      oldRolesToRemove
    );

    //update user on snowflake server
    updateUserOnSnowflake(oldUserData, client, enterprises);

    Logger.info(`User updated successfully`);
    //send response
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      'User updated successfully',
      updatedUser
    );
  } catch (_e) {
    console.log('~ _e', _e);
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

export default updateUser;
