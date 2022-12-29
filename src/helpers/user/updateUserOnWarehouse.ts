import { UserI } from '../../interface/user/user';
import { getCustomRepository } from 'typeorm';
import { EnterpriseRepository } from '../../repository/enterprise';
import { EnterpriseI } from '../../interface/enterprise/enterprise';
import { ClientRepository } from '../../repository/client';
// import { USER_TYPE } from "../../../config/config";
// import DECRYPT from "../../utility/decrypt";
// import { insertEnterprise } from "../../services/postgres/insertEnterprise";
// import { removeEnterprise } from "../../services/postgres/removeEnterprise";
// import SnowflakeService from "../../services/snowflake/snowflake";
const updateUserOnWarehouse = async (
  user: UserI,
  client: any,
  newEnterprisesData: any[]
) => {
  console.log('newEnterprisesData', newEnterprisesData);
  const clientRepo = getCustomRepository(ClientRepository);
  const clientData = await clientRepo.getClientDetails({ id: client });

  const enterpriseRepo = getCustomRepository(EnterpriseRepository);
  //fetch data of user enterprises
  const oldEnterprisesData: EnterpriseI[] = user.enterprises;
  console.log('oldEnterprisesData', oldEnterprisesData);
  // const config = clientData?.config;
  //remove old enterprise ids
  for (let idx = 0; idx < oldEnterprisesData.length; idx++) {
    const id = oldEnterprisesData[idx].id;
    const enterpriseID = oldEnterprisesData[idx].enterpriseID;
    const whereEnterprise: EnterpriseI = {
      user: user,
      client: client,
      id,
      enterpriseID,
    };
    console.log(
      '~ whereEnterprise',
      clientData.clientID,
      user.id,
      enterpriseID
    );

    await enterpriseRepo.removeEnterprise(whereEnterprise);
    // if (config.snowflakeAccount) {
    //   console.log("config.snowflakeAccount: ", config.snowflakeAccount);
    //   const snowflakeServiceRemove = new SnowflakeService(
    //     clientData?.config.snowflakeAccount,
    //     clientData?.config.snowflakeUsername,
    //     DECRYPT(clientData?.config.snowflakePassword),
    //     clientData?.config.snowflakeDatabase,
    //     clientData?.config.snowflakeRole,
    //     clientData?.config.snowflakeWarehouse,
    //     true
    //   );
    //   await snowflakeServiceRemove.removeEnterprise(
    //     clientData.clientID,
    //     user.id,
    //     enterpriseID
    //   );
    // } else {
    //   console.log("config.medraHost: ", config.medraHost);
    //   await removeEnterprise(
    //     config.medraHost,
    //     config.medraDBName,
    //     config.medraUsername,
    //     DECRYPT(config.medraPass),
    //     clientData.clientID,
    //     user.id,
    //     enterpriseID
    //   );
    // }
  }

  //add new enterprise ids
  for (let idx = 0; idx < newEnterprisesData.length; idx++) {
    const enterprise = newEnterprisesData[idx].ENTERPRISE_ID;
    const name = newEnterprisesData[idx].ENTERPRISE_NAME;
    const newEnterprise: EnterpriseI = {
      user: user,
      client: client,
      enterpriseID: enterprise,
      enterpriseName: name,
    };
    await enterpriseRepo.createEnterprise(newEnterprise);
    // if (config.snowflakeAccount) {
    //   const snowflakeServiceAdd = new SnowflakeService(
    //     clientData?.config.snowflakeAccount,
    //     clientData?.config.snowflakeUsername,
    //     DECRYPT(clientData?.config.snowflakePassword),
    //     clientData?.config.snowflakeDatabase,
    //     clientData?.config.snowflakeRole,
    //     clientData?.config.snowflakeWarehouse,
    //     true
    //   );

    //   await snowflakeServiceAdd.insertEnterprise(
    //     clientData.clientID,
    //     clientData.name,
    //     user.id,
    //     user.username,
    //     enterprise,
    //     USER_TYPE.USER,
    //     user.username
    //   );
    // } else {
    //   insertEnterprise(
    //     config.medraHost,
    //     config.medraUsername,
    //     DECRYPT(config.medraPass),
    //     config.medraDBName,
    //     client.clientID,
    //     client.name,
    //     user.id,
    //     user.username,
    //     enterprise,
    //     USER_TYPE.USER,
    //     user.username
    //   );
    // }
  }
};

export default updateUserOnWarehouse;
