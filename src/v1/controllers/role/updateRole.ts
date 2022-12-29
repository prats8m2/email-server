import { Request, Response } from 'express';
import { RoleRepository } from '../../repository/role';
import { getCustomRepository } from 'typeorm';
import sendResponse from '../../utility/response';
import Logger from '../../utility/logger';
import { CODE } from '../../../../config/config';
import updateRoleOnReport from '../../helpers/role/updateRoleOnReport';
import { RoleI } from '../../interface/role/role';
import { modifyPermission } from '../../services/reports/permission';
import { ClientRepository } from '../../repository/client';
import { fetchAdminCreds } from '../../helpers/client/fetchAdminCreds';
import { ClientI } from '../../interface/client/client';

const updateRole = async (req: Request, res: Response) => {
  try {
    const { site, folders, permissions, client } = req.body;
    Logger.info(`Role update request`);
    //fetch data from token
    const { loggedInId: updatedBy } = res.locals;

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
      updatedBy,
    };

    role.permission = modifyPermission(permissions);
    //update new role in the db
    const updatedRole = await roleRepo.updateRole(role);

    const { adminUsername, adminPassword } = fetchAdminCreds(clientData);

    await updateRoleOnReport(
      role,
      site,
      folders,
      permissions,
      adminUsername,
      adminPassword
    );

    Logger.info(`Role updated successfully`);
    //send response
    sendResponse(
      res,
      true,
      CODE.SUCCESS,
      'Role updated successfully',
      updatedRole
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

export default updateRole;
