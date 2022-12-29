import { createConnection } from 'typeorm';

export const updateMedra = async (
  host: string,
  port: number,
  database: string,
  username: string,
  password: string,
  value: boolean
): Promise<any> => {
  try {
    const valueMeddra = value === true ? '1' : '0';
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
        `Update ug_dwh.uan_cnf_incr_position set load_flag=${valueMeddra} where load_type = 'Meddra'`
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
