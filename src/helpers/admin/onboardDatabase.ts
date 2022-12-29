import { RoleI } from '../../interface/role/role';
import SUPER_ADMIN_PERMISSIONS from '../../constants/permissions/superAdmin';
import { ROLES, ADMIN_ACCOUNT_NAME, FOLDERS } from '../../../config/config';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';
import { UserI } from '../../interface/user/user';
import { UserRepository } from '../../repository/user';
import { FolderI } from '../../interface/role/folder';

const onboardDatabase = async (
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string
) => {
  const roleRepo = getCustomRepository(RoleRepository);
  const userRepp = getCustomRepository(UserRepository);
  const newRole: RoleI = {
    name: ROLES.SUPER_ADMIN,
    permission: SUPER_ADMIN_PERMISSIONS,
    accountName: ADMIN_ACCOUNT_NAME,
  };

  const role = await roleRepo.createRole(newRole);

  const newUser: UserI = {
    username,
    password,
    email,
    firstName,
    lastName,
    roles: [role],
  };

  await userRepp.createUser(newUser);

  const newFolder: FolderI = {
    name: FOLDERS.MANAGED,
  };
  await roleRepo.createFolder(newFolder);
  newFolder.name = FOLDERS.SELF_SERVICE;
  await roleRepo.createFolder(newFolder);
  newFolder.name = FOLDERS.OOB;
  await roleRepo.createFolder(newFolder);
};

export default onboardDatabase;
