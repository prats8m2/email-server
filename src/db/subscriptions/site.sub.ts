import {
  EntitySubscriberInterface,
  EventSubscriber,
  getManager,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Site } from '../entity/site.entity';
import Logger from '../../utility/logger';
import { Site_Hist } from '../entity/site_hist.entity';
import { User } from '../entity/user.entity';
import { ACTION_TYPE } from '../../../config/config';

@EventSubscriber()
export class SiteSubscriber implements EntitySubscriberInterface<Site> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return Site;
  }

  /**
   * Called after site insertion.
   */
  afterInsert(event: InsertEvent<Site>) {
    Logger.info(`Add data to hist table`);
    (async () => {
      const userData = await getManager().findOne(User, {
        id: event.entity.createdBy,
      });
      const siteHist = {
        _id: event.entity.id,
        action: ACTION_TYPE.ADD,
        name: event.entity.name,
        version: 1,
        modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
      };

      getManager().save(Site_Hist, siteHist);
    })();
  }

  /**
   * Called after site insertion.
   */
  afterUpdate(event: UpdateEvent<Site>): void | Promise<any> {
    Logger.info(`Update data to hist table`);
    if (event.databaseEntity) {
      const oldData = JSON.parse(JSON.stringify(event.databaseEntity));
      (async () => {
        const userData = await getManager().findOne(User, {
          id: event.entity.updatedBy || event.entity.deletedBy,
        });
        for (let index = 0; index < event.updatedColumns.length; index++) {
          const column = event.updatedColumns[index];
          const columnName = column.propertyName;
          if (columnName !== 'updatedBy') {
            if (columnName === 'password') {
              oldData[column.propertyName] = '**Masked**';
              event.entity[column.propertyName] = '**Masked**';
            }
            const siteHist = {
              _id: event.entity.id,
              name: event.databaseEntity.name,
              action:
                columnName === 'deletedBy'
                  ? ACTION_TYPE.DELETE
                  : ACTION_TYPE.UPDATE,
              update: column.propertyName,
              modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
              oldData:
                columnName === 'deletedBy'
                  ? null
                  : oldData[column.propertyName],
              newData:
                columnName === 'deletedBy'
                  ? null
                  : event.entity[column.propertyName],
              version: event.entity.version,
            };
            getManager().save(Site_Hist, siteHist);
          }
        }
      })();
    }
  }

  //NOT ABLE TO IMPLEMENT SOFT REMOVE EVENT BCZ NO ENTITY DATA IS COMING
}
