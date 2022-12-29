import { createConnection } from 'typeorm';

export const getEnterprise = async (
  host: string,
  database: string,
  username: string,
  password: string,
  clientID: string
): Promise<any> => {
  try {
    const connectionResult = await createConnection({
      connectTimeoutMS: 9000,
      type: 'postgres',
      name: clientID + '_pg',
      host,
      port: 5432,
      database,
      username,
      password,
    });
    console.log('connectionResult', connectionResult.options);
    const isConnected = connectionResult?.isConnected === true ? true : false;
    if (isConnected) {
      const result = await connectionResult.query(
        `select ENTERPRISE_ID, ENTERPRISE_NAME from UAN_DWH_STG.arg_cfg_enterprise_stg where deleted is null and client_id = ${clientID}`
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
