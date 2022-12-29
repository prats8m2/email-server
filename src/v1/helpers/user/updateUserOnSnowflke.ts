import { UserI } from '../../interface/user/user';
import { getCustomRepository } from 'typeorm';
import { EnterpriseRepository } from '../../repository/enterprise';
import { EnterpriseI } from '../../interface/enterprise/enterprise';
import { ClientRepository } from '../../repository/client';
import SnowflakeService from '../../services/snowflake/snowflake';
import { USER_TYPE } from '../../../../config/config';
import DECRYPT from '../../utility/decrypt';
const updateUserOnSnowflake = async (
  user: UserI,
  client: any,
  newEnterprisesData: any[]
) => {
  const newEnterprises: any[] = [];

  const clientRepo = getCustomRepository(ClientRepository);
  const clientData = await clientRepo.getClientDetails({ id: client });
  const snowflakeService = new SnowflakeService(
    clientData?.config.snowflakeAccount,
    clientData?.config.snowflakeUsername,
    DECRYPT(clientData?.config.snowflakePassword),
    clientData?.config.snowflakeDatabase,
    clientData?.config.snowflakeRole,
    clientData?.config.snowflakeWarehouse,
    true
  );

  for (let index = 0; index < newEnterprisesData.length; index++) {
    const enterpriseData = newEnterprisesData[index];
    newEnterprises.push(enterpriseData.ENTERPRISE_ID);
  }
  //array for old enterprise ids
  const oldEnterprises: number[] = [];

  const enterpriseRepo = getCustomRepository(EnterpriseRepository);
  //fetch data of user enterprises
  const oldEnterprisesData: EnterpriseI[] = user.enterprises;

  //parse enterprise data to get enterprise id array
  for (let index = 0; index < oldEnterprisesData?.length; index++) {
    const oldEnterpriseData: EnterpriseI = oldEnterprisesData[index];
    oldEnterprises.push(oldEnterpriseData.enterpriseID);
  }

  //filter out new enterprise ids to add
  const newEnterprisesToAdd = newEnterprises.filter(
    x => !oldEnterprises.includes(x)
  );
  //filter out old enterprise ids to remove
  const oldEnterprisesToRemove = oldEnterprises.filter(
    x => !newEnterprises.includes(x)
  );
  //add new enterprise ids
  for (let idx = 0; idx < newEnterprisesToAdd.length; idx++) {
    const enterprise = newEnterprisesToAdd[idx];
    let name = null;
    for (let index = 0; index < newEnterprisesData.length; index++) {
      const enterpriseData = newEnterprisesData[index];
      if (enterpriseData.ENTERPRISE_ID === enterprise) {
        name = enterpriseData.ENTERPRISE_NAME;
      }
    }
    const newEnterprise: EnterpriseI = {
      user: user,
      client: client,
      enterpriseID: enterprise,
      enterpriseName: name,
    };
    await enterpriseRepo.createEnterprise(newEnterprise);
    await snowflakeService.insertEnterprise(
      clientData.clientID,
      clientData.name,
      user.id,
      user.username,
      enterprise,
      USER_TYPE.USER,
      user.username
    );
  }

  //remove old enterprise ids
  for (let idx = 0; idx < oldEnterprisesToRemove.length; idx++) {
    const enterprise = oldEnterprisesToRemove[idx];
    const whereEnterprise: EnterpriseI = {
      user: user,
      client: client,
      enterpriseID: enterprise,
    };

    await enterpriseRepo.removeEnterprise(whereEnterprise);
    await snowflakeService.removeEnterprise(
      clientData.clientID,
      user.id,
      enterprise
    );
  }
};

export default updateUserOnSnowflake;
