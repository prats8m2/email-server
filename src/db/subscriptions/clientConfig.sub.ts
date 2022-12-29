import {
  EntitySubscriberInterface,
  EventSubscriber,
  getManager,
  UpdateEvent,
} from 'typeorm';
import { ClientConfig } from '../entity/clientConfig.entity';
import Logger from '../../utility/logger';
import { ClientConfig_Hist } from '../entity/clientConfig_hist.entity';
import { Client } from '../entity/client.entity';
import { User } from '../entity/user.entity';
import { ACTION_TYPE } from '../../../config/config';

@EventSubscriber()
export class ClientConfigSubscriber
  implements EntitySubscriberInterface<ClientConfig>
{
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return ClientConfig;
  }

  /**
   * Called after clientConfig insertion.
   */
  afterUpdate(event: UpdateEvent<ClientConfig>): void | Promise<any> {
    Logger.info(`Add data to hist table`);
    const oldData = JSON.parse(JSON.stringify(event.databaseEntity));

    (async () => {
      const clientData = await getManager().findOne(Client, {
        config: event.entity.id,
      });
      const userData = await getManager().findOne(User, {
        id: event.entity.updatedBy,
      });
      let name;
      let oldDataPass;
      let newDataPass;
      const medraCol = ['medraHost', 'medraUsername', 'medraPass', 'medraPort'];
      const etlCol = ['airflowURL'];
      const snowflakeCol = [
        'snowflakeAccount',
        'snowflakeUsername',
        'snowflakePassword',
        'snowflakeDatabase',
        'snowflakeRole',
        'snowflakeWarehouse',
      ];

      const airflowCol = [
        'airflowENV',
        'awsAccessKey',
        'awsSecretKey',
        'awsRegion',
      ];

      const maskCol = [
        'medraPass',
        'snowflakePassword',
        'awsAccessKey',
        'awsSecretKey',
      ];

      for (let index = 0; index < event.updatedColumns.length; index++) {
        const column = event.updatedColumns[index];
        const columnName = column.propertyName;
        if (medraCol.includes(columnName)) {
          name = 'Dictionary Config';
        }
        if (etlCol.includes(columnName)) {
          name = 'ETL Config';
        }
        if (snowflakeCol.includes(columnName)) {
          name = 'Snowflake Config';
        }

        if (airflowCol.includes(columnName)) {
          name = 'Airflow Config';
        }
        if (columnName !== 'updatedBy') {
          if (maskCol.includes(columnName)) {
            oldDataPass = '**Masked**';
            newDataPass = '**Masked**';
          }
          const configHist = {
            _id: event.entity.id,
            action: ACTION_TYPE.UPDATE,
            name,
            modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
            newData: newDataPass || event.entity[columnName],
            oldData: oldDataPass || oldData[columnName],
            update: columnName,
            clientID: clientData.id,
            version: event.entity.version,
          };

          getManager().save(ClientConfig_Hist, configHist);
        }
      }
    })();
  }
}
