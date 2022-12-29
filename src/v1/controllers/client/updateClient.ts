import { Request, Response } from 'express';
import { ClientRepository } from '../../repository/client';
import { getCustomRepository } from 'typeorm';
import MD5 from 'md5';
import sendResponse from '../../utility/response';
import Logger from '../../utility/logger';
import { CODE } from '../../../../config/config';

const updateClient = async (req: Request, res: Response) => {
  try {
    // const { sites, adminUsername, adminPassword } = req.body;
    //fetch data from token
    const { adminPassword } = req.body;
    const { loggedInId: updatedBy, existingClientData } = res.locals;
    Logger.info(`Update client request`);
    //create client repo instance
    const clientRepo = getCustomRepository(ClientRepository);

    //create a client object
    const client = {
      ...req.body,
      adminPassword: adminPassword
        ? MD5(adminPassword)
        : existingClientData.password,
      updatedBy,
    };
    // addDefaultRoles(
    //   existingClientData,
    //   sites,
    //   adminUsername,
    //   adminPassword,
    //   updatedBy
    // );

    //update new client in the db
    const updatedClient = await clientRepo.updateClient(client);

    //assign default roles for client

    //send response
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      'Client updated successfully',
      updatedClient
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

export default updateClient;
