import { Request, Response } from 'express';
import Logger from '../../utility/logger';
import sendResponse from '../../utility/response';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';
import { RoleI } from '../../interface/role/role';
import { CODE } from '../../../config/config';
import ReportService from '../../services/reports/report';
import DECRYPT from '../../utility/decrypt';
import { ClientRepository } from '../../repository/client';
import { ClientI } from '../../interface/client/client';
import { fetchAdminCreds } from '../../helpers/client/fetchAdminCreds';

const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    Logger.info(`Delete role request`);
    const { loggedInId: deletedBy } = res.locals;
    //create repo instance
    const roleRepo = getCustomRepository(RoleRepository);
    const clientRepo = getCustomRepository(ClientRepository);
    const role: RoleI = await roleRepo.getRoleDetails({ id });
    const client: ClientI = await clientRepo.getClientDetails({
      id: role.client.id,
    });
    const { adminUsername, adminPassword } = fetchAdminCreds(client);

    if (role.isDefault) {
      sendResponse(res, false, CODE.READ_ONLY, 'Read only role', role.name);
      return;
    }

    if (role.users?.length) {
      sendResponse(
        res,
        false,
        CODE.DENIED,
        'Please remove assigned users before deleting roles',
        role.name
      );
      return;
    }
    role.deletedBy = deletedBy;

    //set deleted by data
    await roleRepo.updateRole(role);

    //remove role from db
    const result = roleRepo.removeRole(id);
    const site = role?.site;
    const reportService = new ReportService(
      site.ip,
      site.port,
      `${role.accountName}\\${adminUsername}:${DECRYPT(adminPassword)}`,
      role.accountName
    );

    await reportService.deleteRole(role.name);

    Logger.info(`Role deleted successfully`);
    sendResponse(res, true, CODE.SUCCESS, 'Role deleted successfully', result);
  } catch (_e) {
    Logger.error(_e);
    console.log('~ _e', _e);
    sendResponse(res, false, CODE.SERVER_ERROR, 'Some error occurred');
  }
};

export default deleteRole;
