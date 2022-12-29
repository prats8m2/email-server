import { createConnection } from 'typeorm';

export const getMedra = async (
  host: string,
  port: number,
  database: string,
  username: string,
  password: string
): Promise<any> => {
  try {
    const connectionResult = await createConnection({
      connectTimeoutMS: 5000,
      name: database,
      type: 'postgres',
      host,
      port,
      database,
      username,
      password,
    });
    const isConnected = connectionResult?.isConnected === true ? true : false;
    if (isConnected) {
      const result = await connectionResult.query(
        `select * from ug_dwh.uan_cnf_incr_position ucip where load_type like 'Meddra'`
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
