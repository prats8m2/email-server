import { UserI } from '../../interface/user/user';
import { getCustomRepository } from 'typeorm';
import ReportService from '../../services/reports/report';
import { SiteI } from '../../interface/site/site';
import { EnterpriseRepository } from '../../repository/enterprise';
import { ClientI } from '../../interface/client/client';
import { EnterpriseI } from '../../interface/enterprise/enterprise';
import { fetchAdminCreds } from '../client/fetchAdminCreds';
import { ClientRepository } from '../../repository/client';
import DECRYPT from '../../utility/decrypt';
const deleteUserOnReport = async (user: UserI) => {
  const enterpriseRepo = getCustomRepository(EnterpriseRepository);
  const clientRepo = getCustomRepository(ClientRepository);

  const enterpriseData: EnterpriseI[] =
    await enterpriseRepo.getAllEnterpriseByUser(user.id);

  for (let index = 0; index < enterpriseData.length; index++) {
    const site: SiteI = enterpriseData[index].client.sites[0];
    const client: ClientI = enterpriseData[index].client;

    //get client info
    const clientData: ClientI = await clientRepo.getClientDetails({
      id: client.id,
    });
    const { adminUsername, adminPassword } = fetchAdminCreds(clientData);

    const auth = `${client.name}\\${adminUsername}:${DECRYPT(adminPassword)}`;
    const reportService = new ReportService(
      site.ip,
      site.port,
      auth,
      client.name
    );
    await reportService.deleteUser(user.username);
  }
};

export default deleteUserOnReport;
