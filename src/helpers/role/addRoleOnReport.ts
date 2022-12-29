import { getCustomRepository } from 'typeorm';
import ReportService from '../../services/reports/report';
import { SiteI } from '../../interface/site/site';
import { FolderI } from '../../interface/role/folder';
import { SiteRepository } from '../../repository/site';
import { mapPermission } from '../../services/reports/permission';
import { RoleI } from '../../interface/role/role';
import DEFAULT_PERMISSIONS from '../../constants/permissions/default';
import DECRYPT from '../../utility/decrypt';

const addRoleOnReport = async (
  role: RoleI,
  siteData: { id: string },
  folders: FolderI[],
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
  await reportService.createRole(role.name);

  if (folders && folders.length) {
    const folder = folders[0];
    await reportService.assignRoleToFolder(
      role.name,
      folder.name,
      mapPermission(DEFAULT_PERMISSIONS)
    );
  }
};

export default addRoleOnReport;
