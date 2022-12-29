import { createConnection } from 'typeorm';

export const updateWHO = async (
  host: string,
  port: number,
  database: string,
  username: string,
  password: string,
  value: string
): Promise<any> => {
  try {
    value = value ? (value === 'B' ? 'B' : 'C') : null;
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
      if (value) {
        const load_type_1 = value === 'B' ? 'WHO_B' : 'WHO_C';
        const load_type_0 = value === 'B' ? 'WHO_C' : 'WHO_B';
        const result = await connectionResult.query(
          `Update ug_dwh.uan_cnf_incr_position set load_flag = '1' where load_type like '${load_type_1}'`
        );
        await connectionResult.query(
          `Update ug_dwh.uan_cnf_incr_position set load_flag = '0' where load_type like '${load_type_0}'`
        );
        await connectionResult.close();
        return result;
      } else {
        const response = await connectionResult.query(
          `Update ug_dwh.uan_cnf_incr_position set load_flag = '0' where load_type = 'WHO_C' OR load_type = 'WHO_B'`
        );
        await connectionResult.close();
        return response;
      }
    } else {
      await connectionResult.close();
      return null;
    }
  } catch (_e) {
    return _e.message;
  }
};
