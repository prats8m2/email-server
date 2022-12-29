import { UserI } from '../../interface/user/user';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';
import { ClientI } from '../../interface/client/client';
import ReportService from '../../services/reports/report';
import { fetchAdminCreds } from '../client/fetchAdminCreds';
import DECRYPT from '../../utility/decrypt';

const removeRolesFromUser = async (user: UserI) => {
  const client = user.roles[0].client;
  //fetch client data
  const clientRepo = getCustomRepository(ClientRepository);
  const clientData: ClientI = await clientRepo.getClientDetails({
    id: client.id,
  });
  const { adminUsername, adminPassword } = fetchAdminCreds(clientData);
  const auth = `${clientData.name}\\${adminUsername}:${DECRYPT(adminPassword)}`;

  const { ip, port } = clientData.sites[0];
  const reportService = new ReportService(ip, port, auth, clientData.name);

  for (let index = 0; index < user.roles.length; index++) {
    const role = user.roles[index];
    await reportService.removeRoleFromUser(role.name, user.username);
  }

  await reportService.deleteUser(user.username);
};

export default removeRolesFromUser;
