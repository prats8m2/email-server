import { UserI } from '../../interface/user/user';

const filterNewRoles = async (oldUserData: UserI, roles: { id: string }[]) => {
  const newRole: string[] = [];
  const oldRole: string[] = [];
  if (oldUserData?.roles?.length)
    for (let index = 0; index < oldUserData?.roles?.length; index++) {
      const oldUserRoles = oldUserData?.roles[index];
      oldRole.push(oldUserRoles.id);
    }

  if (roles?.length)
    for (let index = 0; index < roles?.length; index++) {
      const role = roles?.[index];
      newRole.push(role.id);
    }

  const newRolesToAdd = newRole.filter(x => !oldRole.includes(x));
  const oldRolesToRemove = oldRole.filter(x => !newRole.includes(x));
  return {
    newRolesToAdd,
    oldRolesToRemove,
  };
};

export default filterNewRoles;
