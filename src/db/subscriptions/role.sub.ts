import {
  EntitySubscriberInterface,
  EventSubscriber,
  getManager,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Role } from '../entity/role.entity';
import Logger from '../../utility/logger';
import { Role_Hist } from '../entity/role_hist.entity';
import { User } from '../entity/user.entity';
import { ACTION_TYPE } from '../../../config/config';

@EventSubscriber()
export class RoleSubscriber implements EntitySubscriberInterface<Role> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return Role;
  }

  /**
   * Called after role insertion.
   */
  afterInsert(event: InsertEvent<Role>) {
    Logger.info(`Add data to hist table`);
    if (event.entity.client) {
      (async () => {
        const userData = await getManager().findOne(User, {
          id: event.entity.createdBy,
        });
        const roleHist = {
          _id: event.entity.id,
          action: ACTION_TYPE.ADD,
          name: event.entity.name,
          version: 1,
          modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
          clientID: event.entity.client.id,
        };
        getManager().save(Role_Hist, roleHist);
      })();
    }
  }

  /**
   * Called after role insertion.
   */
  afterUpdate(event: UpdateEvent<Role>): void | Promise<any> {
    Logger.info(`update data to hist table`);
    (async () => {
      if (event.entity) {
        const userData = await getManager().findOne(User, {
          id: event.entity?.updatedBy || event.entity?.deletedBy,
        });

        const roleHist = {
          _id: event.entity.id,
          action: event.entity?.updatedBy
            ? ACTION_TYPE.UPDATE
            : ACTION_TYPE.DELETE,
          name: event.entity.name,
          modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
          clientID: event.entity.client.id,
          version: event.entity.version,
          update: event.entity?.updatedBy ? 'Permissions' : 'N/A',
        };
        getManager().save(Role_Hist, roleHist);
      }
    })();
  }
}
