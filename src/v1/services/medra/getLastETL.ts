import { createConnection } from 'typeorm';

export const getLastETL = async (
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
      name: 'ETL',
      host,
      port,
      database,
      username,
      password,
    });
    const isConnected = connectionResult?.isConnected === true ? true : false;
    if (isConnected) {
      const result = await connectionResult.query(
        `select max(start_time) from ug_dwh.UAN_LOG_BATCH_DTLS
         where (Upper(batch_type)='HOURLY' OR Upper(batch_type)='DAILY') and upper(status)='SUCCESS' and upper(phase)='INGESTION' and batch_id='1'`
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
