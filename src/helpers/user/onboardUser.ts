import ReportService from '../../services/reports/report';
import { SiteI } from '../../interface/site/site';
import { UserI } from '../../interface/user/user';
import { RoleI } from '../../interface/role/role';
import { getCustomRepository } from 'typeorm';
import { RoleRepository } from '../../repository/role';
import { ClientI } from '../../interface/client/client';
import Logger from '../../utility/logger';
import { ClientRepository } from '../../repository/client';
import { fetchAdminCreds } from '../client/fetchAdminCreds';
import DECRYPT from '../../utility/decrypt';

const onboardUser = async (
  roles: RoleI[],
  user: UserI,
  password: string,
  client: ClientI
) => {
  try {
    const clientRepo = getCustomRepository(ClientRepository);

    const site: SiteI = client.sites[0];
    let SYNC = false;

    //get client info
    const clientData: ClientI = await clientRepo.getClientDetails({
      id: client.id,
    });

    const { adminUsername, adminPassword } = fetchAdminCreds(clientData);

    //create auth token string
    const auth = `${client.name}\\${adminUsername}:${DECRYPT(adminPassword)}`;

    //initialize a report server instance
    const reportService = new ReportService(
      site.ip,
      site.port,
      auth,
      client.name
    );
    //create user on the reporting server
    await reportService.createUser(
      user.username,
      user.email,
      password,
      user.firstName + ' ' + user.lastName
    );

    const assignRolePromise = [];

    //fetch data of all the roles
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index];

      const roleRepo = getCustomRepository(RoleRepository);
      //fetch roles details
      const roleData: RoleI = await roleRepo.getRoleDetails({ id: role.id });

      //assign user to roles
      assignRolePromise.push(
        reportService.assignRoleToUser(roleData.name, user.username)
      );
    }

    await Promise.all([...assignRolePromise])
      .then(resp => {
        Logger.info(`User added and role assigned`, resp);
        SYNC = true;
      })
      .catch(err => {
        Logger.error(`Not able to add user or assigned role`, err);
      });

    return SYNC;
  } catch (_e) {
    console.log(_e);
  }
};

export default onboardUser;
