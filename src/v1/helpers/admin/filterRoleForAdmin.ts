import { Role } from '../../../db/entity/role.entity';
import { ClientI } from '../../interface/client/client';
import { SiteI } from '../../interface/site/site';
import { RoleI } from '../../interface/role/role';
import createRoleForAdmin from './createRoleForAdmin';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';
const filterRoleForAdmin = async (
  existingRoles: Role[],
  clients: ClientI[],
  sites: SiteI[],
  updatedBy: string
) => {
  const rolesToRemove: RoleI[] = [];

  for (let index = 0; index < existingRoles.length; index++) {
    const existingRole: RoleI = existingRoles[index];
    let flag = false;
    if (clients.length) {
      for (let clientIdx = 0; clientIdx < clients.length; clientIdx++) {
        const client: ClientI = clients[clientIdx];
        const site: SiteI = sites[clientIdx];
        if (existingRole.client === client && existingRole.site === site) {
          flag = true;
          clients.splice(clientIdx, 1);
          sites.splice(clientIdx, 1);
        }
      }
    }
    if (!flag) {
      rolesToRemove.push(existingRole);
    }
  }
  let newRoles: RoleI[] = [];
  if (clients.length) {
    newRoles = await createRoleForAdmin(clients, sites, null, updatedBy);
  }
  const roleRepo = getCustomRepository(RoleRepository);
  for (let index = 0; index < rolesToRemove.length; index++) {
    const id = rolesToRemove[index]?.id;
    await roleRepo.deleteRole(id);
  }
  return newRoles;
};

export default filterRoleForAdmin;
