import { ClientI } from '../../interface/client/client';
import { RoleI } from '../../interface/role/role';
import { ROLES } from '../../../config/config';
export const fetchAdminCreds = (client: ClientI) => {
  const roles: RoleI[] = client.roles;
  for (let index = 0; index < roles.length; index++) {
    const role = roles[index];
    if (role.name === ROLES.ADMIN) {
      const { adminUsername, adminPassword } = role;
      return { adminUsername, adminPassword };
    }
  }
};
