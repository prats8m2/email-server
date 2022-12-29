import { createConnection } from 'typeorm';

export const getWHO = async (
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
      name: database,
      host,
      port,
      database,
      username,
      password,
    });
    const isConnected = connectionResult?.isConnected === true ? true : false;
    if (isConnected) {
      const result = await connectionResult.query(
        `SELECT * FROM ug_dwh.uan_cnf_incr_position where load_type ='WHO_C' OR load_type ='WHO_B';`
      );
      await connectionResult.close();
      return result;
    } else {
      await connectionResult.close();
      return null;
    }
  } catch (_e) {
    return _e.message;
  }
};
