import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import { ClientI } from '../../interface/client/client';
import { CODE } from '../../../../config/config';
import { RoleRepository } from '../../repository/role';

const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { loggedInId: deletedBy } = res.locals;
    Logger.info(`Delete client request`);
    //create repo instance
    const clientRepo = getCustomRepository(ClientRepository);
    const roleRepo = getCustomRepository(RoleRepository);

    const client: ClientI = await clientRepo.getClientDetails({ id });
    client.deletedBy = deletedBy;

    //set deleted by data
    await clientRepo.updateClient(client);
    await roleRepo.removeRole({ client: id });

    //TODO: Remove other data related to client
    //remove client from db
    const result = await clientRepo.removeClient({ id });

    Logger.info(`Client deleted successfully`);
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      'Client deleted successfully',
      result
    );
  } catch (_e) {
    Logger.error(_e);
    console.log('~ _e', _e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default deleteClient;
