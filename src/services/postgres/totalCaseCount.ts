import { createConnection } from 'typeorm';

export const totalCaseCount = async (
  clientID: string,
  host: string,
  port: number,
  database: string,
  username: string,
  password: string
): Promise<any> => {
  try {
    const connectionResult = await createConnection({
      connectTimeoutMS: 5000,
      type: 'postgres',
      name: 'pg',
      host,
      port,
      database,
      username,
      password,
    });
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
