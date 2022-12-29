import { SiteI } from '../../interface/site/site';
import { getCustomRepository } from 'typeorm';
import { SiteRepository } from '../../repository/site';
import { FOLDERS, ROLES, SERVER_TYPE } from '../../../config/config';
import ReportService from '../../services/reports/report';
import { mapPermission } from '../../services/reports/permission';
import MANAGED_REPORT_PERMISSIONS from '../../constants/permissions/managedReport';
import OOB_REPORT_PERMISSIONS from '../../constants/permissions/oobReport';
import SELF_SERVICE_PERMISSIONS from '../../constants/permissions/selfService';
import SUPPORT_PERMISSIONS from '../../constants/permissions/support';
import Logger from '../../utility/logger';
const onboardClient = async (
  sites: SiteI[],
  clientName: string,
  adminUsername: string,
  adminPassword: string
) => {
  for (let index = 0; index < sites.length; index++) {
    const id = sites[index].id;

    //fetch site data from db
    const siteRepo = getCustomRepository(SiteRepository);
    const siteData: SiteI = await siteRepo.getSite({ id });

    //check the site type
    if (siteData.type === SERVER_TYPE.REPORTING) {
      //create resources on the reporting server
      const result = await onboardClientOnReportingServer(
        siteData,
        clientName,
        adminUsername,
        adminPassword
      );
      return result;
    } else {
      //This will be use in future with dashboard server
      return false;
    }
  }
};

const onboardClientOnReportingServer = async (
  siteData: SiteI,
  clientName: string,
  adminUsername: string,
  adminPassword: string
): Promise<any> => {
  let SYNC = null;
  //create a new instance of reporting server
  const reportService = new ReportService(
    siteData.ip,
    siteData.port,
    `${clientName}\\${adminUsername}:${adminPassword}`,
    clientName
  );

  //Create folders for org on reporting server
  await Promise.all([
    reportService.createFolder(FOLDERS.MANAGED),
    reportService.createFolder(FOLDERS.OOB),
    reportService.createFolder(FOLDERS.SELF_SERVICE),
  ])
    .then((resp: any) => {
      Logger.info('Folders created successfully', resp);
    })
    .catch((err: any) => {
      Logger.error('Folders creation failed', err);
      SYNC = false;
    });

  //Create roles for org on reporting server
  await Promise.all([
    reportService.createRole(ROLES.MANAGED_ACCESS),
    reportService.createRole(ROLES.OOB_ACCESS),
    reportService.createRole(ROLES.SELF_SERVICE_ACCESS),
    reportService.createRole(ROLES.SUPPORT),
  ])
    .then((resp: any) => {
      Logger.info('Roles created successfully', resp);
    })
    .catch((err: any) => {
      Logger.error('Roles creation failed', err);
      SYNC = false;
    });

  //Assign roles to folder on reporting server
  await Promise.all([
    reportService.assignRoleToFolder(
      ROLES.MANAGED_ACCESS,
      FOLDERS.MANAGED,
      mapPermission(MANAGED_REPORT_PERMISSIONS)
    ),
    reportService.assignRoleToFolder(
      ROLES.OOB_ACCESS,
      FOLDERS.OOB,
      mapPermission(OOB_REPORT_PERMISSIONS)
    ),
    reportService.assignRoleToFolder(
      ROLES.SELF_SERVICE_ACCESS,
      FOLDERS.SELF_SERVICE,
      mapPermission(SELF_SERVICE_PERMISSIONS)
    ),
    reportService.removeAllRolesFromFolder(FOLDERS.ORG_COMPONENT),
  ])
    .then((resp: any) => {
      Logger.info('Roles assignment completed', resp);
      SYNC = true;
    })
    .catch((err: any) => {
      Logger.error('Role Resp', err);
      SYNC = false;
    });

  //Assign roles to folder on reporting server
  await Promise.all([
    reportService.assignRoleToFolder(
      ROLES.SUPPORT,
      FOLDERS.SELF_SERVICE,
      mapPermission(SUPPORT_PERMISSIONS)
    ),
    reportService.assignRoleToFolder(
      ROLES.SUPPORT,
      FOLDERS.MANAGED,
      mapPermission(SUPPORT_PERMISSIONS)
    ),
    reportService.assignRoleToFolder(
      ROLES.SUPPORT,
      FOLDERS.OOB,
      mapPermission(SUPPORT_PERMISSIONS)
    ),
  ])
    .then((resp: any) => {
      Logger.info('Support Role assignment completed', resp);
      SYNC = true;
    })
    .catch((err: any) => {
      Logger.error('Role Resp', err);
      SYNC = err;
    });

  return SYNC;
};

export default onboardClient;
