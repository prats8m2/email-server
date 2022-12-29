import { createConnection } from 'typeorm';
import { findDashMax, findDashMin } from '../../utility/minMax';
import { getLastETL } from '../../v1/services/medra/getLastETL';

export const dashboardData = async (
  configData: any,
  enterpriseId: string,
  duration: string
): Promise<any> => {
  try {
    const { host, port, database, username, password } = configData;
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
    const resp: any[] = [];
    if (isConnected) {
      const durationQuery = getDurationQuery(enterpriseId, duration);

      await Promise.allSettled([
        //case count by report type
        connectionResult.query(
          `SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, UCI.CASE_REPORT_TYPE, COUNT(DISTINCT UCI.CASE_ID)
                  FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
                  WHERE UCI.CASE_DELETED IS NULL
                  AND UCI.CASE_STATE_ID <> 1 
                  AND  UCI.ENTERPRISE_ID = ${enterpriseId}
                  GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, UCI.CASE_REPORT_TYPE;`
        ),

        //caseVolumeByTime
        connectionResult.query(durationQuery),

        //top PT count
        connectionResult.query(
          `SELECT * FROM
          (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, EVT.PREF_TERM, COUNT(EVT.CASE_ID::text || EVT.SEQ_NUM::text) AS EVT_CNT FROM UAN_DWH_EDW.UAN_CASE_INFO UCI ,UAN_DWH_EDW.UAN_EVENT_INFO EVT
          WHERE UCI.ENTERPRISE_ID = ${enterpriseId} and EVT.CASE_ID = UCI.CASE_ID AND UCI.CASE_DELETED IS NULL AND EVT.DELETED IS NULL 
          AND UCI.CASE_STATE_ID != 1 GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, EVT.PREF_TERM) AS topPTCount
          ORDER BY EVT_CNT DESC LIMIT 10`
        ),
        //count of submission
        connectionResult.query(
          `SELECT CLIENT_ID, ENTERPRISE_ID, PENDING_SUBMITTED, COUNT(DISTINCT(REG_REPORT_ID)) SUBM_CNT 
                  FROM (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, CASE WHEN REP.DATE_SUBMITTED IS NULL AND REP.DATE_GENERATED IS NOT NULL THEN 'Pending'
                  WHEN REP.DATE_SUBMITTED IS NOT NULL THEN 'Submitted' END PENDING_SUBMITTED
                  ,REP.REG_REPORT_ID
                  FROM UAN_DWH_EDW.UAN_REG_REPORTS REP
                  ,UAN_DWH_EDW.UAN_CASE_INFO UCI
                  WHERE UCI.CASE_ID = REP.CASE_ID
                  AND UCI.CASE_DELETED IS NULL
                  AND UCI.CASE_STATE_ID <> 1 
                  AND REP.CRR_DELETED IS NULL
                  AND REP.CMN_DELETED IS NULL) AS countOFSubmission
                  WHERE PENDING_SUBMITTED IS NOT NULL
                  AND  ENTERPRISE_ID = ${enterpriseId}
                  GROUP BY CLIENT_ID, ENTERPRISE_ID, PENDING_SUBMITTED;`
        ),
        //total case count
        connectionResult.query(
          `SELECT COUNT(CASE_NUM) as total FROM UAN_DWH_EDW.UAN_CASE_INFO UCI where UCI.ENTERPRISE_ID = ${enterpriseId}`
        ),
        getLastETL(host, port, database, username, password),
      ])
        .then(async (resp: any) => {
          console.log('resp', resp);
          const result: any[] = [
            {
              type: 'Case count by report type',
              data: resp[0].value,
              max: findDashMax(resp[0].value, 'count'),
              min: findDashMin(resp[0].value, 'count)'),
            },
            {
              type: 'Case volume by time',
              data: resp[1].value,
              max: findDashMax(resp[1].value, 'case_count'),
              min: findDashMin(resp[1].value, 'case_count'),
            },
            {
              type: 'Top PT counts',
              data: resp[2].value,
              max: findDashMax(resp[2].value, 'evt_cnt'),
              min: findDashMin(resp[2].value, 'evt_cnt'),
            },
            {
              type: 'Count of submission',
              data: resp[3].value,
              max: findDashMax(resp[3].value, 'subm_cnt'),
              min: findDashMin(resp[3].value, 'subm_cnt'),
            },
            {
              type: 'Total case count',
              data: resp[4]?.value[0]?.TOTAL,
            },
          ];

          console.log('resp[0].value', resp[0].value);
          console.log('resp[1].value', resp[1].value);
          console.log('resp[2].value', resp[2].value);
          console.log('resp[3].value', resp[3].value);
          console.log('resp[4].value', resp[4].value);
          console.log('result', result);
          await connectionResult.close();
          resp = result;
        })
        .catch((err: any) => {
          console.log('Err Resp', err);
        });
      return resp;
    } else {
      await connectionResult.close();
      return null;
    }
  } catch (_e) {
    console.log('~ _e', _e);
    return _e.message;
  }
};

function getDurationQuery(enterpriseId: string, duration: string) {
  let query = '';
  switch (duration) {
    case 'All Time':
      query = `select * from (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, 'All Time' AS DATE_TYPE  , 
      EXTRACT(YEAR FROM UCI.CASE_INIT_REPT_DATE )::text AS TIME_PD,COUNT(DISTINCT(UCI.CASE_ID)) 
      CASE_COUNT  FROM UAN_DWH_EDW.UAN_CASE_INFO UCI  WHERE UCI.ENTERPRISE_ID = ${enterpriseId} and UCI.CASE_DELETED 
      IS NULL  AND UCI.CASE_STATE_ID <> 1  AND '${duration}' = 'All Time' GROUP BY UCI.CLIENT_ID, 
      UCI.ENTERPRISE_ID, DATE_TYPE, TIME_PD  ORDER BY time_pd) as tem`;
      break;
    case 'Last 7 days':
      query = `select * from (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, 'Last 7 days' AS DATE_TYPE,extract (DAY FROM UCI.CASE_INIT_REPT_DATE) || '-' ||extract (MONTH FROM UCI.CASE_INIT_REPT_DATE) TIME_PD, COUNT(DISTINCT(UCI.CASE_ID)) CASE_COUNT 
              FROM UAN_DWH_EDW.UAN_CASE_INFO UCI 
              WHERE UCI.CASE_DELETED IS NULL 
              AND UCI.CASE_STATE_ID <> 1 
              AND UCI.CASE_INIT_REPT_DATE >= CURRENT_DATE - 6
              AND '${duration}' = 'Last 7 days'
              AND UCI.ENTERPRISE_ID = ${enterpriseId}
              GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, DATE_TYPE, TIME_PD
              ) A
              ORDER BY TO_CHAR(TO_DATE(TIME_PD, 'DD-MON')::date,'MM-DD')`;
      break;
    case 'Last 15 days':
      query = `select * from (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, 'Last 15 days' AS DATE_TYPE
              ,extract (Day from UCI.CASE_INIT_REPT_DATE) || '-' || EXTRACT(MONTH FROM UCI.CASE_INIT_REPT_DATE) TIME_PD
              ,COUNT(DISTINCT(UCI.CASE_ID)) CASE_COUNT
              FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
              WHERE UCI.CASE_DELETED IS NULL
              AND UCI.CASE_STATE_ID <> 1
              AND UCI.CASE_INIT_REPT_DATE >= CURRENT_DATE - 14
              AND 'Last 15 days' = 'Last 15 days'
              AND UCI.ENTERPRISE_ID = 1
              GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, DATE_TYPE, TIME_PD) a
              ORDER BY TO_CHAR(TO_DATE(TIME_PD, 'DD-MON')::date,'MM-DD');
              `;
      break;
    case 'Last 30 days':
      query = `select * from (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, 'Last 30 days' AS DATE_TYPE
              ,EXTRACT(DAY FROM UCI.CASE_INIT_REPT_DATE) || '-' || EXTRACT(MONTH FROM UCI.CASE_INIT_REPT_DATE) TIME_PD
              ,COUNT(DISTINCT(UCI.CASE_ID)) CASE_COUNT
              FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
              WHERE UCI.CASE_DELETED IS NULL
              AND UCI.CASE_STATE_ID <> 1
              AND UCI.CASE_INIT_REPT_DATE >= CURRENT_DATE - 29
              AND 'Last 30 days' = 'Last 30 days'
              AND UCI.ENTERPRISE_ID = 1
              GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, DATE_TYPE, TIME_PD) A
              ORDER BY TO_CHAR(TO_DATE(TIME_PD, 'DD-MON')::date,'MM-DD')`;
      break;
    case 'Last 1 Year':
      query = `select * from (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, 'Last 1 Year' AS DATE_TYPE
                ,EXTRACT(MONTH FROM UCI.CASE_INIT_REPT_DATE) || '-' || EXTRACT(YEAR FROM UCI.CASE_INIT_REPT_DATE) TIME_PD
                ,COUNT(DISTINCT(UCI.CASE_ID)) CASE_COUNT
                FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
                WHERE UCI.CASE_DELETED IS NULL
                AND UCI.CASE_STATE_ID <> 1
                AND UCI.CASE_INIT_REPT_DATE >= (current_date - '1 Year'::interval)::date
                AND 'Last 1 Year' = 'Last 1 Year'
                AND UCI.ENTERPRISE_ID = 1
                GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, DATE_TYPE, TIME_PD) a
                ORDER BY TO_CHAR(TO_DATE(TIME_PD, 'MM-YYYY')::date,'YYYY-MM')
                  `;
  }

  return query;
}
