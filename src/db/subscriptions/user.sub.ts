import {
  EntitySubscriberInterface,
  EventSubscriber,
  getManager,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from '../entity/user.entity';
import Logger from '../../utility/logger';
import { User_Hist } from '../entity/user_hist.entity';
import { Role } from '../entity/role.entity';
import { ACTION_TYPE, USER_TYPE, ROLES } from '../../../config/config';
import { EnterpriseI } from '../../interface/enterprise/enterprise';
import { Enterprise } from '../entity/enterprise.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return User;
  }

  /**
   * Called after user insertion.
   */
  afterInsert(event: InsertEvent<User>) {
    Logger.info(`Add data to hist table`);
    const roleId = event.entity?.roles[0]?.id;
    (async () => {
      const roleData = await getManager().findOne(
        Role,
        { id: roleId },
        { relations: ['client'] }
      );
      const type =
        roleData.name === ROLES.ADMIN ? USER_TYPE.ADMIN : USER_TYPE.USER;

      const userData = await getManager().findOne(User, {
        id: event.entity.createdBy,
      });

      const userHist = {
        _id: event.entity.id,
        action: ACTION_TYPE.ADD,
        name: event.entity.username,
        modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
        version: 1,
        clientID: type === USER_TYPE.USER ? roleData.client?.id : null,
        type,
      };

      getManager().save(User_Hist, userHist);
    })();
  }

  /**
   * Called after user insertion.
   */
  afterUpdate(event: UpdateEvent<User>): void | Promise<any> {
    Logger.info(`Add data to hist table`);
    // console.log("~ event", event);

    let oldData;
    const newEnterprises: any[] = [];
    const oldEnterprises: any[] = [];
    // let newEnterprisesToAdd;
    let oldEnterprisesToRemove;
    const newEnterprisesData: any[] = event.entity.enterprises;
    oldData = JSON.parse(JSON.stringify(event.databaseEntity));

    if (event.databaseEntity) {
      if (newEnterprisesData) {
        oldData = JSON.parse(JSON.stringify(event.databaseEntity));
        for (let index = 0; index < newEnterprisesData.length; index++) {
          const enterpriseData = newEnterprisesData[index];
          if (enterpriseData.id) newEnterprises.push(enterpriseData.id);
        }
        //array for old enterprise ids

        const oldEnterprisesData: any[] = event.databaseEntity.enterprises;

        //parse enterprise data to get enterprise id array
        for (let index = 0; index < oldEnterprisesData?.length; index++) {
          const oldEnterpriseData: EnterpriseI = oldEnterprisesData[index];
          oldEnterprises.push(oldEnterpriseData.id);
        }

        //filter out new enterprise ids to add
        // newEnterprisesToAdd = newEnterprises.filter(
        //   (x) => !oldEnterprises.includes(x)
        // );
        //filter out old enterprise ids to remove
        oldEnterprisesToRemove = oldEnterprises.filter(
          x => !newEnterprises.includes(x)
        );
      }
    } else {
      return;
    }

    if (!event.entity?.roles) return;
    const roleId = event.entity?.roles[0]?.id;
    (async () => {
      const roleData = await getManager().findOne(
        Role,
        { id: roleId },
        { relations: ['client'] }
      );
      const userData = await getManager().findOne(User, {
        id: event.entity.updatedBy || event.entity.deletedBy,
      });

      const type =
        roleData.name === ROLES.ADMIN ? USER_TYPE.ADMIN : USER_TYPE.USER;
      for (let index = 0; index < event.updatedColumns.length; index++) {
        const column = event.updatedColumns[index];
        const columnName = column.propertyName;
        if (
          columnName !== 'updatedBy' &&
          columnName !== 'lastLogin' &&
          columnName !== 'isFirstLogin' &&
          columnName != 'tokenExpiration' &&
          columnName != 'token'
        ) {
          if (columnName === 'password') {
            oldData[column.propertyName] = '**Masked**';
            event.entity[column.propertyName] = '**Masked**';
          }
          const userHist = {
            _id: event.entity.id,
            action: event.entity.deletedBy
              ? ACTION_TYPE.DELETE
              : ACTION_TYPE.UPDATE,
            name: event.entity.username,
            update: column.propertyName,
            modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
            oldData:
              columnName === 'password' ? '**Masked**' : oldData[columnName],
            newData:
              columnName === 'password'
                ? '**Masked**'
                : event.entity[columnName],
            clientID: roleData.client ? roleData.client.id : null,
            type,
            version: event.entity.version,
          };
          getManager().save(User_Hist, userHist);
        }
      }

      if (newEnterprisesData)
        for (let index = 0; index < newEnterprisesData.length; index++) {
          const element = newEnterprisesData[index];
          if (!element.id) {
            const userHist = {
              _id: event.entity.id,
              action: event.entity.deletedBy
                ? ACTION_TYPE.DELETE
                : ACTION_TYPE.UPDATE,
              name: event.entity.username,
              update: 'Tenant',
              modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
              oldData: 'N/A',
              newData: element.ENTERPRISE_NAME,
              clientID: roleData.client ? roleData.client.id : null,
              type,
              version: event.entity.version,
            };
            getManager().save(User_Hist, userHist);
          }
        }
      if (oldEnterprisesToRemove)
        for (let index = 0; index < oldEnterprisesToRemove.length; index++) {
          const element = oldEnterprisesToRemove[index];
          const enterpriseData: EnterpriseI = await getManager().findOne(
            Enterprise,
            {
              where: { id: element },
            }
          );
          const userHist = {
            _id: event.entity.id,
            action: event.entity.deletedBy
              ? ACTION_TYPE.DELETE
              : ACTION_TYPE.UPDATE,
            name: event.entity.username,
            update: 'Tenant',
            modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
            oldData: enterpriseData.enterpriseName,
            newData: 'N/A',
            clientID: roleData.client ? roleData.client.id : null,
            type,
            version: event.entity.version,
          };
          getManager().save(User_Hist, userHist);
        }
    })();
  }
}
