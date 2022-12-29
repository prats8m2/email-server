import { ClientI } from '../../interface/client/client';
import { SiteI } from '../../interface/site/site';
import { RoleRepository } from '../../repository/role';
import { UserRepository } from '../../repository/user';
import { getCustomRepository } from 'typeorm';
import { RoleI } from '../../interface/role/role';
import { ROLES, ADMIN_ACCOUNT_NAME } from '../../../../config/config';
import ADMIN_PERMISSIONS from '../../constants/permissions/admin';
import { UserI } from '../../interface/user/user';
//function to assign clients to admin
const assignClientToAdmin = async (
  newClient: ClientI,
  sites: SiteI[],
  createdBy: string
) => {
  const roleRepo = getCustomRepository(RoleRepository);
  const userRepo = getCustomRepository(UserRepository);
  //create a new admin role
  let newRole: RoleI;
  const roles: RoleI[] = [];

  for (let index = 0; index < sites.length; index++) {
    const client = newClient;
    const site = sites[index];
    newRole = {
      name: ROLES.ADMIN,
      permission: ADMIN_PERMISSIONS,
      accountName: ADMIN_ACCOUNT_NAME,
      isDefault: true,
      client,
      site,
      createdBy,
    };
    const result = await roleRepo.createRole(newRole);
    roles.push(result);

    const admin: UserI = await userRepo.getAdmin({ id: createdBy });
    admin.roles = [...admin.roles, ...roles];
    await userRepo.updateUser(admin);
  }
};

export default assignClientToAdmin;
