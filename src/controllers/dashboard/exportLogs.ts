import { Request, Response } from 'express';
import { MAX_ROW, LOG_TYPE, USER_TYPE, ROLES } from '../../../config/config';
import { getManager, getCustomRepository, In } from 'typeorm';
import { Site_Hist } from '../../db/entity/site_hist.entity';
import { Client_Hist } from '../../db/entity/client_hist.entity';
import { ClientConfig_Hist } from '../../db/entity/clientConfig_hist.entity';
import { User_Hist } from '../../db/entity/user_hist.entity';
import { Role_Hist } from '../../db/entity/role_hist.entity';
import Moment from 'moment';

import * as path from 'path';
import Logger from '../../utility/logger';
import { UserRepository } from '../../repository/user';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const exportLogs = async (req: Request, res: Response) => {
  const { type, client, page = 1, row = MAX_ROW } = req.body;

  const { loggedInId, loggedInRole } = res.locals;

  Logger.info(`Export log request`);
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
  // const workbook = new XL.Workbook();
  // const worksheet = workbook.addWorksheet("My Sheet");
  // worksheet.columns = [
  //   { header: "Id", key: "id", width: 32 },
  //   { header: "Name", key: "name", width: 22 },
  //   { header: "Field Name", key: "fieldName", width: 10, outlineLevel: 1 },
  //   { header: "Activity Type", key: "action", width: 10, outlineLevel: 1 },
  //   { header: "Version", key: "version", width: 10, outlineLevel: 1 },
  //   {
  //     header: "Last Updated by",
  //     key: "modifiedBy",
  //     width: 15,
  //     outlineLevel: 1,
  //   },
  //   {
  //     header: "Last Updated on",
  //     key: "modifiedOn",
  //     width: 15,
  //     outlineLevel: 1,
  //   },
  //   {
  //     header: "Old Value of the Record",
  //     key: "oldData",
  //     width: 15,
  //     outlineLevel: 1,
  //   },
  //   {
  //     header: "New Value of the Record",
  //     key: "newData",
  //     width: 15,
  //     outlineLevel: 1,
  //   },
  // ];
  const data: any[] = [];
  for (let index = 0; index < count; index++) {
    const element = list[index];
    data.push([
      {
        content: element.name,
        // colSpan: 2,
        // rowSpan: 2,
      },
      {
        content: element.version,
        // colSpan: 2,
        // rowSpan: 2,
      },
      {
        content: element.update,
        // colSpan: 4,
        // rowSpan: 2,
      },
      {
        content: element.action,
        // colSpan: 4,
        // rowSpan: 2,
      },
      {
        content: element.modifiedBy,
        // colSpan: 4,
        // rowSpan: 2,
      },
      {
        content: Moment(element.modifiedOn).format('DD-MMM-YYYY, HH:MM:SS'),
        // colSpan: 4,
        // rowSpan: 2,
      },
      {
        content: typeof element.oldData === 'object' ? 'N/A' : element.oldData,
        // colSpan: 4,
        // rowSpan: 2,
      },
      {
        content: typeof element.newData === 'object' ? 'N/A' : element.newData,
        // colSpan: 8,
        // rowSpan: 2,
      },
    ]);
  }

  // await workbook.xlsx.writeFile(
  //   path.join(
  //     __dirname + `../../../../public/${type}_${client ? client : ""}_logs.xls`
  //   )
  // );
  const doc = new jsPDF();

  // It can parse html:
  // <table id="my-table"><!-- ... --></table>
  autoTable(doc, { html: '#my-table' });

  // Or use javascript directly:
  autoTable(doc, {
    head: [
      [
        'Name',
        'Version',
        'Field Name',
        'Activity Type',
        'Updated by',
        'Updated on',
        'Old Value',
        'New Value',
      ],
    ],
    body: [...data],
    // tableWidth: 250,
  });

  doc.save(
    path.join(
      __dirname + `../../../../public/${type}_${client ? client : ''}_logs.pdf`
    )
  );

  Logger.info(`Export logs successfully`);
  res.sendFile(
    path.join(
      __dirname + `../../../../public/${type}_${client ? client : ''}_logs.pdf`
    )
  );
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
  return [query, query.length];
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

//:TODO remove redundant code
export default exportLogs;
