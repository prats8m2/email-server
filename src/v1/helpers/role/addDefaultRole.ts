import { ROLES, FOLDERS, ADMIN_ACCOUNT_NAME } from '../../../../config/config';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';
import { RoleI } from '../../interface/role/role';
import { ClientI } from '../../interface/client/client';
import { SiteI } from '../../interface/site/site';
import MANAGED_REPORT_PERMISSIONS from '../../constants/permissions/managedReport';
import SELF_SERVICE_PERMISSIONS from '../../constants/permissions/selfService';
import OOB_REPORT_PERMISSIONS from '../../constants/permissions/oobReport';
import ADMIN_PERMISSIONS from '../../constants/permissions/admin';
import { FolderI } from '../../interface/role/folder';
import ENCRYPT from '../../utility/encrypt';
import { fetchAdminCreds } from '../client/fetchAdminCreds';
import DECRYPT from '../../utility/decrypt';
import SUPPORT_PERMISSIONS from '../../constants/permissions/support';

const addDefaultRoles = async (
  client: ClientI,
  sites: SiteI[],
  newAdminUsername: string,
  newAdminPassword: string,
  createdBy: string
) => {
  const roleRepo = getCustomRepository(RoleRepository);
  if (!newAdminPassword) {
    const { adminUsername, adminPassword } = fetchAdminCreds(client);
    newAdminPassword = DECRYPT(adminPassword);
    if (newAdminUsername === adminUsername) {
      newAdminUsername = adminUsername;
    }
  }

  for (let index = 0; index < sites.length; index++) {
    const site = sites[index];

    const result = await roleRepo.getRole({ client, site });
    const folders: FolderI[] = await roleRepo.getAllFolder();
    const folderMap: any = {};
    for (let index = 0; index < folders.length; index++) {
      const folder = folders[index];
      folderMap[folder.name] = folder.id;
    }
    if (!result) {
      //create a new role for organization access
      const managedRole: RoleI = {
        client,
        site,
        permission: MANAGED_REPORT_PERMISSIONS,
        name: ROLES.MANAGED_ACCESS,
        accountName: client.name,
        isDefault: true,
        createdBy,
        folders: [{ id: folderMap[FOLDERS.MANAGED] }],
      };
      await roleRepo.createRole(managedRole);
      //create a new role for organization access
      const serviceRole: RoleI = {
        client,
        site,
        permission: SELF_SERVICE_PERMISSIONS,
        name: ROLES.SELF_SERVICE_ACCESS,
        accountName: client.name,
        isDefault: true,
        createdBy,
        folders: [{ id: folderMap[FOLDERS.SELF_SERVICE] }],
      };
      await roleRepo.createRole(serviceRole);

      //create a new role for organization access
      const oobRole: RoleI = {
        client,
        site,
        permission: OOB_REPORT_PERMISSIONS,
        name: ROLES.OOB_ACCESS,
        accountName: client.name,
        isDefault: true,
        createdBy,
        folders: [{ id: folderMap[FOLDERS.OOB] }],
      };
      await roleRepo.createRole(oobRole);

      //create a new role for support access
      const supportRole: RoleI = {
        client,
        site,
        permission: SUPPORT_PERMISSIONS,
        name: ROLES.SUPPORT,
        accountName: client.name,
        isDefault: true,
        createdBy,
        folders: [
          { id: folderMap[FOLDERS.MANAGED] },
          { id: folderMap[FOLDERS.SELF_SERVICE] },
          { id: folderMap[FOLDERS.OOB] },
        ],
      };
      await roleRepo.createRole(supportRole);

      //create a new role for admin access
      const adminRole: RoleI = {
        client,
        site,
        permission: ADMIN_PERMISSIONS,
        name: ROLES.ADMIN,
        accountName: ADMIN_ACCOUNT_NAME,
        isDefault: true,
        createdBy,
        adminUsername: newAdminUsername,
        adminPassword: ENCRYPT(newAdminPassword),
      };

      await roleRepo.createRole(adminRole);
    }
  }
};

export default addDefaultRoles;
