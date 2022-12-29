import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';
import sendResponse from '../../utility/response';
import { RoleI } from '../../interface/role/role';
import { CODE } from '../../../../config/config';
import DEFAULT_PERMISSIONS from '../../constants/permissions/default';
import { ClientRepository } from '../../repository/client';
import { ClientI } from '../../interface/client/client';
import addRoleOnReport from '../../helpers/role/addRoleOnReport';
import { fetchAdminCreds } from '../../helpers/client/fetchAdminCreds';

const addRole = async (req: Request, res: Response) => {
  try {
    //fetch data from body
    const { client, folders, site } = req.body;
    Logger.info(`Add role request`);
    //fetch data from token
    const { loggedInId: createdBy } = res.locals;

    //create role repo instance
    const roleRepo = getCustomRepository(RoleRepository);
    const clientRepo = getCustomRepository(ClientRepository);

    //get client info
    const clientData: ClientI = await clientRepo.getClientDetails({
      id: client.id,
    });

    //create a role object
    const role: RoleI = {
      ...req.body,
      permission: DEFAULT_PERMISSIONS,
      accountName: clientData?.name,
      createdBy,
    };
    //add new role in the db
    const newRole: RoleI = await roleRepo.createRole(role);
    const { adminUsername, adminPassword } = fetchAdminCreds(clientData);

    //add role on reporting server
    await addRoleOnReport(newRole, site, folders, adminUsername, adminPassword);
    Logger.info(`Role added successfully`);
    //send response
    sendResponse(res, true, CODE.SUCCESS, 'Role added successfully', newRole);
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

export default addRole;
