import ReportService from '../../services/reports/report';
import { SiteI } from '../../interface/site/site';
import { UserI } from '../../interface/user/user';
import { RoleI } from '../../interface/role/role';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';
import { ClientI } from '../../interface/client/client';
import Logger from '../../utility/logger';
import { ClientRepository } from '../../repository/client';
import { fetchAdminCreds } from '../client/fetchAdminCreds';
import DECRYPT from '../../utility/decrypt';
const updateUserOnReport = async (
  roles: RoleI[],
  user: UserI,
  clientId: string,
  newRolesToAdd: string[],
  oldRolesToRemove: string[]
) => {
  const addedClient: string[] = [];
  let editUserPromise;
  const assignRolePromise = [];
  let SYNC = false;
  const roleRepo = getCustomRepository(RoleRepository);
  const clientRepo = getCustomRepository(ClientRepository);

  //get client info
  const clientData: ClientI = await clientRepo.getClientDetails({
    id: clientId,
  });
  const { adminUsername, adminPassword } = fetchAdminCreds(clientData);

  //Update user details and add new roles
  for (let index = 0; index < roles.length; index++) {
    const role = roles[index];

    //fetch roles details
    const roleData: RoleI = await roleRepo.getRoleDetails({ id: role.id });
    const site: SiteI = roleData.site;
    const client: ClientI = roleData.client;
    const auth = `${client.name}\\${adminUsername}:${DECRYPT(adminPassword)}`;

    const reportService = new ReportService(
      site.ip,
      site.port,
      auth,
      client.name
    );
    if (!addedClient.includes(client.id)) {
      editUserPromise = reportService.editUser(
        user.username,
        user.email,
        user.firstName + ' ' + user.lastName,
        user.status
      );
    }

    if (newRolesToAdd.includes(role.id)) {
      Logger.info(`Role: ${roleData.name} assigned to User: ${user.username}`);
      assignRolePromise.push(
        reportService.assignRoleToUser(roleData.name, user.username)
      );
    }

    addedClient.push(client.id);
  }

  const removeRolePromise = [];
  //remove old role
  for (let index = 0; index < oldRolesToRemove.length; index++) {
    const role = oldRolesToRemove[index];
    const roleData: RoleI = await roleRepo.getRoleDetails({ id: role });
    const site: SiteI = roleData.site;
    const client: ClientI = roleData.client;
    const auth = `${client.name}\\${adminUsername}:${DECRYPT(adminPassword)}`;

    const reportService = new ReportService(
      site.ip,
      site.port,
      auth,
      client.name
    );
    Logger.info(`Role: ${roleData.name} removed from User: ${user.username}`);
    removeRolePromise.push(
      reportService.removeRoleFromUser(roleData.name, user.username)
    );
  }

  await Promise.all([
    editUserPromise,
    ...assignRolePromise,
    ...removeRolePromise,
  ])
    .then(resp => {
      Logger.info(`User updated ,new role assigned, old roles removed`, resp);
      SYNC = true;
    })
    .catch(err => {
      Logger.error(
        `Not able to update user or assign new role or remove old role`,
        err
      );
    });

  return SYNC;
};

export default updateUserOnReport;
