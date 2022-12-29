import { getCustomRepository } from 'typeorm';
import ReportService from '../../services/reports/report';
import { SiteI } from '../../interface/site/site';
import { FolderI } from '../../interface/role/folder';
import { SiteRepository } from '../../repository/site';
import { mapPermission } from '../../services/reports/permission';
import { RoleI } from '../../interface/role/role';
import { PermissionsI } from '../../interface/role/permissions';
import DECRYPT from '../../utility/decrypt';

const updateRoleOnReport = async (
  role: RoleI,
  siteData: { id: string },
  folders: FolderI[],
  permissions: PermissionsI,
  adminUsername: string,
  adminPassword: string
) => {
  const siteRepo = getCustomRepository(SiteRepository);
  const site: SiteI = await siteRepo.getSite({ id: siteData.id });
  const auth = `${role.accountName}\\${adminUsername}:${DECRYPT(
    adminPassword
  )}`;
  const reportService = new ReportService(
    site.ip,
    site.port,
    auth,
    role.accountName
  );

  for (let index = 0; index < folders.length; index++) {
    const folder = folders[index];
    await reportService.assignRoleToFolder(
      role.name,
      folder.name,
      mapPermission(permissions)
    );
  }
};

export default updateRoleOnReport;
