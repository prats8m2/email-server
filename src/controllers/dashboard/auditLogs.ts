import { Request, Response } from 'express';
import { getManager, getCustomRepository, In } from 'typeorm';
import { LOG_TYPE, CODE, USER_TYPE, ROLES } from '../../../config/config';
import sendResponse from '../../utility/response';
import { Site_Hist } from '../../db/entity/site_hist.entity';
import { Client_Hist } from '../../db/entity/client_hist.entity';
import { User_Hist } from '../../db/entity/user_hist.entity';
import { ClientConfig_Hist } from '../../db/entity/clientConfig_hist.entity';
import { Role_Hist } from '../../db/entity/role_hist.entity';
import Logger from '../../utility/logger';
import { UserRepository } from '../../repository/user';
export const AuditLog = async (req: Request, res: Response) => {
  Logger.info(`Audit log request`);
  const { type, client, page, row } = req.body;

  const { loggedInId, loggedInRole } = res.locals;

  let list: any[] = [];
  let count = 0;
  switch (type) {
    case LOG_TYPE.SITE:
      [list, count] = await getSiteLogs(page, row);
      break;
    case LOG_TYPE.CLIENT:
      [list, count] = await getClientLogs(page, row, loggedInId, loggedInRole);
      break;
    case LOG_TYPE.CONFIG:
      [list, count] = await getConfigLogs(client, page, row);
      break;
    case LOG_TYPE.ADMIN:
      [list, count] = await getAdminLogs(page, row);
      break;
    case LOG_TYPE.ROLE:
      [list, count] = await getRoleLogs(client, page, row);
      break;
    case LOG_TYPE.USER:
      [list, count] = await getUserLogs(client, page, row);
      break;
    case LOG_TYPE.SETTINGS:
      [list, count] = await getSettingsLogs(client, page, row);
      break;
  }

  Logger.info(`Audit logs sent successfully`);
  sendResponse(res, true, CODE.SUCCESS, `${type} logs`, { count, list });
};

const getSettingsLogs = async (clientId: string, page: any, row: any) => {
  const entityManager = getManager();
  const query = await entityManager.query(
    `Select * from banner_hist where banner_hist."clientID" = '${clientId}' 
    UNION 
    Select * from dictionary_hist where dictionary_hist."clientID" = '${clientId}' ORDER BY "modifiedOn" DESC limit ${row} offset ${
      page - 1
    }`,
    []
  );
  const count = await entityManager.query(
    `Select * from banner_hist where banner_hist."clientID" = '${clientId}' 
    UNION 
    Select * from dictionary_hist where dictionary_hist."clientID" = '${clientId}' ORDER BY "modifiedOn" DESC `,
    []
  );
  return [query, count.length];
};

const getSiteLogs = async (page: any, row: any) => {
  const result = await getManager().findAndCount(Site_Hist, {
    order: {
      modifiedOn: 'DESC',
    },
    skip: (page - 1) * row,
    take: row,
  });
  return result ?? null;
};

const getClientLogs = async (
  page: any,
  row: any,
  loggedInId: string,
  loggedInRole: string
) => {
  if (loggedInRole === ROLES.ADMIN) {
    const userRepo = getCustomRepository(UserRepository);

    const userData = await userRepo.getAdminDetails({ id: loggedInId });
    const clientIdArr = [];

    for (let index = 0; index < userData.roles.length; index++) {
      const role = userData.roles[index];
      clientIdArr.push(role.client.id);
    }
    const result = await getManager().findAndCount(Client_Hist, {
      where: {
        _id: In(clientIdArr),
      },
      order: {
        modifiedOn: 'DESC',
      },
      skip: (page - 1) * row,
      take: row,
    });
    return result ?? null;
  } else {
    const result = await getManager().findAndCount(Client_Hist, {
      order: {
        modifiedOn: 'DESC',
      },
      skip: (page - 1) * row,
      take: row,
    });
    return result ?? null;
  }
};

const getConfigLogs = async (client: string, page: any, row: any) => {
  const result = await getManager().findAndCount(ClientConfig_Hist, {
    order: {
      modifiedOn: 'DESC',
    },
    where: {
      clientID: client,
    },
    skip: (page - 1) * row,
    take: row,
  });
  return result ?? null;
};

const getAdminLogs = async (page: any, row: any) => {
  const result = await getManager().findAndCount(User_Hist, {
    order: {
      modifiedOn: 'DESC',
    },
    where: {
      type: USER_TYPE.ADMIN,
    },
    skip: (page - 1) * row,
    take: row,
  });
  return result ?? null;
};

const getRoleLogs = async (client: string, page: any, row: any) => {
  const result = await getManager().findAndCount(Role_Hist, {
    order: {
      modifiedOn: 'DESC',
    },
    where: {
      clientID: client,
    },
    skip: (page - 1) * row,
    take: row,
  });
  return result ?? null;
};

const getUserLogs = async (client: string, page: any, row: any) => {
  const result = await getManager().findAndCount(User_Hist, {
    order: {
      modifiedOn: 'DESC',
    },
    where: {
      type: USER_TYPE.USER,
      clientID: client,
    },
    skip: (page - 1) * row,
    take: row,
  });
  return result ?? null;
};

// const getSettingLogs = (client, page, row) => {};

export default AuditLog;
