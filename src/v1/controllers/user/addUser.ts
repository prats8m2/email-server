//library
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import MD5 from 'md5';

//files & function
import { UserRepository } from '../../repository/user';
import { ClientRepository } from '../../repository/client';
import sendResponse from '../../utility/response';
import onboardUserOnSnowflake from '../../helpers/user/onboardUserOnSnowflake';
import onboardUser from '../../helpers/user/onboardUser';

//config & interface
import { UserI } from '../../interface/user/user';
import { ClientI } from '../../interface/client/client';
import { CODE } from '../../../../config/config';
import ENCRYPT from '../../utility/encrypt';
import Logger from '../../utility/logger';

/**
 * function to add user in the system
 *
 * @param  {Request} req
 * @param  {Response} res
 */
const addUser = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { password, roles, client, enterprises, username } = req.body;

    Logger.info(`Adding a USER: ${username}`);

    //fetch data from token
    const { loggedInId: createdBy } = res.locals;

    //create user repo instance
    const userRepo = getCustomRepository(UserRepository);
    const clientRepo = getCustomRepository(ClientRepository);
    const clientData: ClientI = await clientRepo.getClientDetails({
      id: client,
    });

    //create a user object
    const user = {
      ...req.body,
      password: MD5(password),
      isFirstLogin: true,
      authToken: ENCRYPT(`${clientData.name}\\${username}:${password}`),
      createdBy,
    };
    //onboard user on the Reporting server
    const onboardStatus = await onboardUser(roles, user, password, clientData);
    if (!onboardStatus) {
      sendResponse(
        res,
        false,
        CODE.REPORTING_SERVER_DOWN,
        'Reporting server down'
      );
      return;
    }
    //add new user in the db
    const newUser: UserI = await userRepo.createUser(user);

    //onboard user on snowflake
    onboardUserOnSnowflake(newUser, client, enterprises);

    //send welcome email to user
    // welcomeEmailToUser(email, `${firstName} ${lastName}`, username, password);
    Logger.info(`User added successfully`);
    //send response
    sendResponse(res, true, CODE.SUCCESS, 'User added successfully', newUser);
  } catch (_e) {
    console.log('~ _e', _e);
    sendResponse(
      res,
      false,
      CODE.SERVER_ERROR,
      'Some error occurred',
      _e.message
    );
  }
};

export default addUser;
