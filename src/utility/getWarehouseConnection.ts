import { ConnectionDetailsI } from '../interface/client/connectionDetails';
import { ClientConfigI } from '../interface/client/clientConfig';
import DECRYPT from '../v1/utility/decrypt';

const getDataWareHouseConnection = (clientConfig: ClientConfigI) => {
  console.log('clientConfig', clientConfig);
  let connectionDetails: ConnectionDetailsI = {
    host: '',
    database: '',
    username: '',
    password: '',
  };

  //check if snowflake data is present
  if (clientConfig?.snowflakeAccount) {
    return false;
  } else if (clientConfig?.medraHost) {
    //if postgres data is present, use postgres
    connectionDetails = {
      host: clientConfig.medraHost,
      database: clientConfig.medraDBName,
      username: clientConfig.medraUsername,
      password: DECRYPT(clientConfig.medraPass),
    };
  } else {
    return null;
  }

  return connectionDetails;
};

export default getDataWareHouseConnection;
