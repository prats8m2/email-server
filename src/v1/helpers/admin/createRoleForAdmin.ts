import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';
import { RoleI } from '../../interface/role/role';
import { ROLES, ADMIN_ACCOUNT_NAME } from '../../../../config/config';
import ADMIN_PERMISSIONS from '../../constants/permissions/admin';
import { ClientI } from '../../interface/client/client';
import { SiteI } from '../../interface/site/site';

const createRoleForAdmin = async (
  clients: ClientI[],
  sites: SiteI[],
  createdBy: string,
  updatedBy: string
) => {
  const roleRepo = getCustomRepository(RoleRepository);

  //create a new admin role
  let newRole: RoleI;
  const roles: RoleI[] = [];

  for (let index = 0; index < clients.length; index++) {
    const client = clients[index];
    const site = sites[index];
    newRole = {
      name: ROLES.ADMIN,
      permission: ADMIN_PERMISSIONS,
      accountName: ADMIN_ACCOUNT_NAME,
      isDefault: true,
      client,
      site,
      createdBy: createdBy ?? undefined,
      updatedBy: updatedBy ?? undefined,
    };
    const result = await roleRepo.createRole(newRole);
    roles.push(result);
  }
  return roles;
};

export default createRoleForAdmin;
