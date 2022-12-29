export interface ClientConfigI {
  id?: string;
  medraHost?: string;
  medraPort?: number;
  medraDBName?: string;
  medraUsername?: string;
  medraPass?: string;
  airflowENV?: string;
  awsRegion?: string;
  awsAccessKey?: string;
  awsSecretKey?: string;
  snowflakeAccount?: string;
  snowflakeUsername?: string;
  snowflakePassword?: string;
  snowflakeDatabase?: string;
  snowflakeRole?: string;
  snowflakeWarehouse?: string;
  createdBy?: string;
  updatedBy?: string;
}
