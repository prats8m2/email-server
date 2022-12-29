import {
  EntitySubscriberInterface,
  EventSubscriber,
  getManager,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Client } from '../entity/client.entity';
import Logger from '../../utility/logger';
import { Client_Hist } from '../entity/client_hist.entity';
import { User } from '../entity/user.entity';
import { ACTION_TYPE } from '../../../config/config';

@EventSubscriber()
export class ClientSubscriber implements EntitySubscriberInterface<Client> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return Client;
  }

  /**
   * Called after client insertion.
   */
  afterInsert(event: InsertEvent<Client>) {
    Logger.info(`Add data to hist table`);
    (async () => {
      const userData = await getManager().findOne(User, {
        id: event.entity.createdBy,
      });
      const siteHist = {
        _id: event.entity.id,
        name: event.entity.name,
        action: ACTION_TYPE.ADD,
        modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
        version: 1,
      };

      getManager().save(Client_Hist, siteHist);
    })();
  }

  /**
   * Called after client insertion.
   */
  afterUpdate(event: UpdateEvent<Client>): void | Promise<any> {
    Logger.info(`Add data to hist table`);
    const oldData = JSON.parse(JSON.stringify(event.databaseEntity));
    (async () => {
      const userData = await getManager().findOne(User, {
        id: event.entity.updatedBy || event.entity.deletedBy,
      });
      for (let index = 0; index < event.updatedColumns.length; index++) {
        const column = event.updatedColumns[index];
        const columnName = column.propertyName;
        if (columnName !== 'updatedBy') {
          const siteHist = {
            _id: event.entity.id,
            name: event.databaseEntity.name,
            action: event.entity.updatedBy
              ? ACTION_TYPE.UPDATE
              : ACTION_TYPE.DELETE,
            update: columnName,
            modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
            oldData: oldData[columnName],
            newData: event.entity[columnName],
            version: event.entity.version,
          };
          getManager().save(Client_Hist, siteHist);
        }
      }
    })();
  }
}
