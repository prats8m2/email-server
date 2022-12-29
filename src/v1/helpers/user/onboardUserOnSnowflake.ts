import { UserI } from '../../interface/user/user';
import { getCustomRepository } from 'typeorm';
import { EnterpriseRepository } from '../../repository/enterprise';
import { ClientRepository } from '../../repository/client';
import SnowflakeService from '../../services/snowflake/snowflake';
import { USER_TYPE } from '../../../../config/config';
import DECRYPT from '../../utility/decrypt';
const onboardUserOnSnowflake = async (
  user: UserI,
  clientId: any,
  newEnterprisesData: any[]
) => {
  const enterprises: any[] = [];
  for (let index = 0; index < newEnterprisesData.length; index++) {
    const enterpriseData = newEnterprisesData[index];
    enterprises.push(enterpriseData.ENTERPRISE_ID);
  }

  const enterpriseRepo = getCustomRepository(EnterpriseRepository);
  const clientRepo = getCustomRepository(ClientRepository);
  const client = await clientRepo.getClientDetails({ id: clientId });
  const snowflakeService = new SnowflakeService(
    client?.config.snowflakeAccount,
    client?.config.snowflakeUsername,
    DECRYPT(client?.config.snowflakePassword),
    client?.config.snowflakeDatabase,
    client?.config.snowflakeRole,
    client?.config.snowflakeWarehouse,
    false
  );
  snowflakeService.connection.connect(async function (err: any, conn: any) {
    if (err) {
      console.log('~ err', err);
    } else {
      for (let idx = 0; idx < enterprises.length; idx++) {
        const enterprise = enterprises[idx];
        const newEnterprise = {
          user: user,
          client: clientId,
          enterpriseID: enterprise,
          enterpriseName: newEnterprisesData[idx].ENTERPRISE_NAME,
        };

        await enterpriseRepo.createEnterprise(newEnterprise);
        conn.execute({
          sqlText: `INSERT INTO UAN_DWH_CNF.UAN_APP_TENANT_USER_MAPPING (CLIENT_ID, CLIENT_NAME, USER_ID, APP_USER_NAME,BI_USER_NAME,USER_TYPE, TENANT_ID) values('${
            client.clientID
          }', '${client.name}', '${user.id}', '${user.username}', '${
            user.username
          }','${USER_TYPE.USER}','${parseInt(enterprise)}')`,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          // eslint-disable-next-line no-unused-vars
          complete: function (err: any, _stmt: any, _rows: any) {
            console.log('~ _rows', _rows);
            // console.log("~ _stmt", _stmt);
            if (err) {
              console.log('~ err', err);
            }
          },
        });
      }
    }
  });
};

export default onboardUserOnSnowflake;
