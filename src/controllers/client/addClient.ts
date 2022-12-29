//library
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

//files & functions
import { ClientRepository } from '../../repository/client';
import { ClientConfigRepository } from '../../repository/clientConfig';
import sendResponse from '../../utility/response';
import Logger from '../../utility/logger';
import addDefaultRoles from '../../helpers/role/addDefaultRole';
import onboardClient from '../../helpers/client/onbaordClient';

//config & interface
import { ClientI } from '../../interface/client/client';
import { CODE } from '../../../config/config';
import { ClientConfigI } from '../../interface/client/clientConfig';

const addClient = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { sites, name, adminUsername, adminPassword } = req.body;
    Logger.info(`Add client request`);

    //fetch data from token
    const { loggedInId: createdBy } = res.locals;

    //create repo instances
    const clientRepo = getCustomRepository(ClientRepository);
    const configRepo = getCustomRepository(ClientConfigRepository);

    //on board client on reporting server
    const onBoardStatus = await onboardClient(
      sites,
      name,
      adminUsername,
      adminPassword
    );

    if (onBoardStatus !== true) {
      sendResponse(
        res,
        false,
        CODE.REPORTING_SERVER_DOWN,
        onBoardStatus.message || 'Reporting server down'
      );
      return;
    }
    //add default configuration for client
    const newConfig: ClientConfigI = await configRepo.createClientConfig();

    //create a client object
    const client: ClientI = {
      ...req.body,
      createdBy,
      config: newConfig,
    };
    //add new client in the db
    const newClient: ClientI = await clientRepo.createClient(client);

    //assign default roles for client
    addDefaultRoles(newClient, sites, adminUsername, adminPassword, createdBy);

    //send welcome email to client
    // welcomeEmailToClient(email, name);

    Logger.info(`Client added successfully`);
    //on board client on snowflake sever
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      'Client added successfully',
      newClient
    );
  } catch (_e) {
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

export default addClient;
