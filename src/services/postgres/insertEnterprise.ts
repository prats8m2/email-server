import { createConnection } from 'typeorm';

export const insertEnterprise = async (
  host: string,
  database: string,
  username: string,
  password: string,
  clientID: string,
  clientName: string,
  userId: string,
  userName: string,
  enterpriseId: number,
  type: string,
  biUserName: string
): Promise<any> => {
  try {
    const connectionResult = await createConnection({
      connectTimeoutMS: 5000,
      type: 'postgres',
      name: 'pg',
      host,
      port: 5432,
      database,
      username,
      password,
    });
    const isConnected = connectionResult?.isConnected === true ? true : false;
    if (isConnected) {
      const result = await connectionResult.query(
        `INSERT INTO UAN_DWH_CNF.UAN_APP_TENANT_USER_MAPPING (CLIENT_ID, CLIENT_NAME, USER_ID, APP_USER_NAME,BI_USER_NAME,USER_TYPE, TENANT_ID) values('${clientID}', '${clientName}', '${userId}', '${userName}', '${biUserName}','${type}','${enterpriseId}')`
      );
      await connectionResult.close();
      return result;
    } else {
      await connectionResult.close();
      return null;
    }
  } catch (_e) {
    console.log('~ _e', _e);
    return _e.message;
  }
};
