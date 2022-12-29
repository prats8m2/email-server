import { createConnection } from 'typeorm';

export const checkMedraConnection = async (
  host: string,
  port: number,
  database: string,
  username: string,
  password: string
): Promise<any> => {
  try {
    const connectionResult = await createConnection({
      connectTimeoutMS: 50000,
      type: 'postgres',
      name: database,
      host,
      port,
      database,
      username,
      password,
    });
    const result = connectionResult?.isConnected === true ? true : false;
    await await connectionResult.close();
    return result;
  } catch (_e) {
    console.log('~ _e', _e);
    return _e.message;
  }
};
