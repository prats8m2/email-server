import { createConnection } from 'typeorm';

export const removeUser = async (
  host: string,
  database: string,
  username: string,
  password: string,
  userId: string
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
        `DELETE FROM UAN_DWH_CNF.UAN_APP_TENANT_USER_MAPPING WHERE USER_ID='${userId}' `
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