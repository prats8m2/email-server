import snowflake from 'snowflake-sdk';
import { SNOWFLAKE_AUTHENTICATOR } from '../../../config/config';
class SnowflakeService {
  connection: any;
  constructor(
    account: string,
    username: string,
    password: string,
    database: string,
    role: string,
    warehouse: string,
    checkConnection = true
  ) {
    this.connection = snowflake.createConnection({
      authenticator: SNOWFLAKE_AUTHENTICATOR,
      account,
      username,
      password: password,
      database,
      role,
      warehouse,
    });

    console.log(this.connection);

    if (checkConnection)
      this.connection.connect(async (err: any, conn: any) => {
        if (err) {
          console.log('~ err', err.message);
          return false;
        } else {
          // console.log("~ conn", conn);
          this.connection = conn;
          return conn;
        }
      });
  }

  public async createDatabase(name: string) {
    await this.connection.execute({
      sqlText: `create database ${name}`,
      complete: function (err: any, stmt: any, rows: any) {
        if (err) {
          console.log('~ err', err);
        } else {
          console.log('~ rows', rows);
        }
      },
    });
  }

  public getEnterprises = async (clientID: string) => {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: `select ENTERPRISE_ID, ENTERPRISE_NAME from UAN_DWH_STG.arg_cfg_enterprise_stg where deleted is null and client_id = ${clientID}`,
        complete: (err: any, stmt: any, rows: any) => {
          if (err) {
            reject(err);
            console.log('~ err', err);
          } else {
            this.connection.destroy();
            resolve(rows);
          }
        },
      });
    });
  };

  public insertEnterprise = async (
    clientID: string,
    clientName: string,
    userId: string,
    userName: string,
    enterpriseId: number,
    type: string,
    biUserName: string
  ) => {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: `INSERT INTO UAN_DWH_CNF.UAN_APP_TENANT_USER_MAPPING (CLIENT_ID, CLIENT_NAME, USER_ID, APP_USER_NAME,BI_USER_NAME,USER_TYPE, TENANT_ID) values('${clientID}', '${clientName}', '${userId}', '${userName}', '${biUserName}','${type}','${enterpriseId}')`,
        complete: function (err: any, stmt: any, rows: any) {
          if (err) {
            reject(err);
            console.log('~ err', err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  };

  public removeEnterprise = async (
    clientID: string,
    userId: string,
    enterpriseId: number
  ) => {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: `DELETE FROM UAN_DWH_CNF.UAN_APP_TENANT_USER_MAPPING WHERE USER_ID='${userId}' AND CLIENT_ID='${clientID}' AND TENANT_ID=${enterpriseId}`,
        complete: function (err: any, stmt: any, rows: any) {
          if (err) {
            reject(err);
            console.log('~ err', err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  };

  public removeUser = async (userId: string) => {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: `DELETE FROM UAN_DWH_CNF.UAN_APP_TENANT_USER_MAPPING WHERE USER_ID='${userId}' `,
        complete: function (err: any, stmt: any, rows: any) {
          if (err) {
            reject(err);
            console.log('~ err', err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  };

  public caseCountByReportType = async (enterpriseId = 1) => {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: `SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, UCI.CASE_REPORT_TYPE, COUNT(DISTINCT UCI.CASE_ID)
                  FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
                  WHERE UCI.CASE_DELETED IS NULL
                  AND UCI.CASE_STATE_ID <> 1 
                  AND  UCI.ENTERPRISE_ID = ${enterpriseId}
                  GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, UCI.CASE_REPORT_TYPE;`,
        complete: function (err: any, stmt: any, rows: any) {
          if (err) {
            reject(err);
            console.log('~ err', err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  };

  public topPTcounts = async (enterpriseId = 1) => {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: `SELECT * FROM (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, EVT.PREF_TERM, COUNT(EVT.CASE_ID || EVT.SEQ_NUM) EVT_CNT
        FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
        ,UAN_DWH_EDW.UAN_EVENT_INFO EVT
        WHERE EVT.CASE_ID = UCI.CASE_ID
        AND UCI.CASE_DELETED IS NULL
        AND EVT.DELETED IS NULL
        AND UCI.CASE_STATE_ID <> 1
        AND  UCI.ENTERPRISE_ID = ${enterpriseId}
        GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, EVT.PREF_TERM)
        ORDER BY EVT_CNT DESC
        LIMIT 10;`,
        complete: function (err: any, stmt: any, rows: any) {
          if (err) {
            reject(err);
            console.log('~ err', err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  };

  public countOfSubmission = async (enterpriseId = 1) => {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: `SELECT CLIENT_ID, ENTERPRISE_ID, PENDING_SUBMITTED, COUNT(DISTINCT(REG_REPORT_ID)) SUBM_CNT 
                  FROM (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, CASE WHEN REP.DATE_SUBMITTED IS NULL AND REP.DATE_GENERATED IS NOT NULL THEN 'Pending'
                  WHEN REP.DATE_SUBMITTED IS NOT NULL THEN 'Submitted' END PENDING_SUBMITTED
                  ,REP.REG_REPORT_ID
                  FROM UAN_DWH_EDW.UAN_REG_REPORTS REP
                  ,UAN_DWH_EDW.UAN_CASE_INFO UCI
                  WHERE UCI.CASE_ID = REP.CASE_ID
                  AND UCI.CASE_DELETED IS NULL
                  AND UCI.CASE_STATE_ID <> 1 
                  AND REP.CRR_DELETED IS NULL
                  AND REP.CMN_DELETED IS NULL)
                  WHERE PENDING_SUBMITTED IS NOT NULL
                  AND  ENTERPRISE_ID = ${enterpriseId}
                  GROUP BY CLIENT_ID, ENTERPRISE_ID, PENDING_SUBMITTED;
                  `,
        complete: function (err: any, stmt: any, rows: any) {
          if (err) {
            reject(err);
            console.log('~ err', err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  };

  public caseCountByCurrentWorkflow = async (enterpriseId = 1) => {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: `SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, UCI.CASE_CURRENT_WF_STATE, COUNT(DISTINCT UCI.CASE_ID)
                  FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
                  WHERE UCI.CASE_DELETED IS NULL
                  AND UCI.CASE_STATE_ID <> 1 
                  AND  UCI.ENTERPRISE_ID = ${enterpriseId}
                  GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID,UCI.CASE_CURRENT_WF_STATE;
                  `,
        complete: function (err: any, stmt: any, rows: any) {
          if (err) {
            reject(err);
            console.log('~ err', err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  };

  public caseVolumeByTime = async (enterpriseId = 1, duration: string) => {
    let query = '';
    return new Promise((resolve, reject) => {
      switch (duration) {
        case 'All Time':
          query = `select * from (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, 'All Time' AS DATE_TYPE
                  ,TO_CHAR(YEAR(UCI.CASE_INIT_REPT_DATE)) TIME_PD
                  ,COUNT(DISTINCT(UCI.CASE_ID)) CASE_COUNT
                  FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
                  WHERE UCI.CASE_DELETED IS NULL
                  AND UCI.CASE_STATE_ID <> 1
                  AND '${duration}' = 'All Time'
                  AND UCI.ENTERPRISE_ID = ${enterpriseId}
                  GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, DATE_TYPE, TIME_PD
                  ORDER BY time_pd)`;
          break;
        case 'Last 7 days':
          query = `select * from (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, 'Last 7 days' AS DATE_TYPE
                  ,DAY(UCI.CASE_INIT_REPT_DATE) || '-' || MONTHNAME(UCI.CASE_INIT_REPT_DATE) TIME_PD
                  ,COUNT(DISTINCT(UCI.CASE_ID)) CASE_COUNT
                  FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
                  WHERE UCI.CASE_DELETED IS NULL
                  AND UCI.CASE_STATE_ID <> 1
                  AND UCI.CASE_INIT_REPT_DATE >= CURRENT_DATE - 6
                  AND '${duration}' = 'Last 7 days'
                  AND UCI.ENTERPRISE_ID = ${enterpriseId}
                  GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, DATE_TYPE, TIME_PD
                  ORDER BY TO_VARCHAR(TO_DATE(TIME_PD, 'DD-MON')::date,'MM-DD'))`;

          break;
        case 'Last 15 days':
          query = `select * from (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, 'Last 15 days' AS DATE_TYPE
                  ,DAY(UCI.CASE_INIT_REPT_DATE) || '-' || MONTHNAME(UCI.CASE_INIT_REPT_DATE) TIME_PD
                  ,COUNT(DISTINCT(UCI.CASE_ID)) CASE_COUNT
                  FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
                  WHERE UCI.CASE_DELETED IS NULL
                  AND UCI.CASE_STATE_ID <> 1
                  AND UCI.CASE_INIT_REPT_DATE >= CURRENT_DATE - 14
                  AND '${duration}' = 'Last 15 days'
                  AND UCI.ENTERPRISE_ID = ${enterpriseId}
                  GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, DATE_TYPE, TIME_PD
                  ORDER BY TO_VARCHAR(TO_DATE(TIME_PD, 'DD-MON')::date,'MM-DD'))
                  `;
          break;
        case 'Last 30 days':
          query = `select * from (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, 'Last 30 days' AS DATE_TYPE
                  ,DAY(UCI.CASE_INIT_REPT_DATE) || '-' || MONTHNAME(UCI.CASE_INIT_REPT_DATE) TIME_PD
                  ,COUNT(DISTINCT(UCI.CASE_ID)) CASE_COUNT
                  FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
                  WHERE UCI.CASE_DELETED IS NULL
                  AND UCI.CASE_STATE_ID <> 1
                  AND UCI.CASE_INIT_REPT_DATE >= CURRENT_DATE - 29
                  AND '${duration}' = 'Last 30 days'
                  AND UCI.ENTERPRISE_ID = ${enterpriseId}
                  GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, DATE_TYPE, TIME_PD
                  ORDER BY TO_VARCHAR(TO_DATE(TIME_PD, 'DD-MON')::date,'MM-DD'))
                  `;
          break;
        case 'Last 1 Year':
          query = `select * from (SELECT UCI.CLIENT_ID, UCI.ENTERPRISE_ID, 'Last 1 Year' AS DATE_TYPE
                  ,MONTHNAME(UCI.CASE_INIT_REPT_DATE) || '-' || YEAR(UCI.CASE_INIT_REPT_DATE) TIME_PD
                  ,COUNT(DISTINCT(UCI.CASE_ID)) CASE_COUNT
                  FROM UAN_DWH_EDW.UAN_CASE_INFO UCI
                  WHERE UCI.CASE_DELETED IS NULL
                  AND UCI.CASE_STATE_ID <> 1
                  AND UCI.CASE_INIT_REPT_DATE >= dateadd(year, -1, current_date)
                  AND '${duration}' = 'Last 1 Year'
                  AND UCI.ENTERPRISE_ID = ${enterpriseId}
                  GROUP BY UCI.CLIENT_ID, UCI.ENTERPRISE_ID, DATE_TYPE, TIME_PD
                  ORDER BY TO_VARCHAR(TO_DATE(TIME_PD, 'MON-YYYY')::date,'YYYY-MM'))
                  `;
      }
      this.connection.execute({
        sqlText: query,
        complete: function (err: any, stmt: any, rows: any) {
          if (err) {
            reject(err);
            console.log('~ err', err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  };

  public totalCaseCount = async (enterpriseId = 1) => {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: `SELECT COUNT(CASE_NUM) as total FROM UAN_DWH_EDW.UAN_CASE_INFO UCI where UCI.ENTERPRISE_ID = ${enterpriseId};`,
        complete: function (err: any, stmt: any, rows: any) {
          if (err) {
            reject(err);
            console.log('~ err', err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  };

  //Add code to sync snowflake data
}

export default SnowflakeService;
