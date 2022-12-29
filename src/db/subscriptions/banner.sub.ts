import {
  EntitySubscriberInterface,
  EventSubscriber,
  getManager,
  InsertEvent,
} from 'typeorm';
import Logger from '../../utility/logger';
import { Client } from '../entity/client.entity';
import { User } from '../entity/user.entity';
import { ACTION_TYPE, BANNER_TYPE } from '../../../config/config';
import { Banner } from '../entity/banner.entity';
import { Banner_Hist } from '../entity/banner_hist.entity';

@EventSubscriber()
export class BannerSubscriber implements EntitySubscriberInterface<Banner> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return Banner;
  }

  /**
   * Called after clientConfig insertion.
   */
  afterInsert(event: InsertEvent<Banner>): void | Promise<any> {
    Logger.info(`Add data to hist table`);
    const newData = event.entity;
    (async () => {
      const clientData = await getManager().findOne(
        Client,
        {
          id: event.entity.client.id,
        },
        {
          relations: ['banners'],
        }
      );
      const oldData = clientData.banners[clientData.banners.length - 2];
      const userData = await getManager().findOne(User, {
        id: event.entity.updatedBy,
      });

      if (oldData) {
        const version = clientData.banners.length;
        if (oldData.title !== newData.title) {
          const banner = {
            _id: event.entity.id,
            action: ACTION_TYPE.UPDATE,
            name: 'Notification banner',
            modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
            newData: newData.title,
            update: 'title',
            oldData: oldData.title,
            clientID: newData.client.id,
            version,
          };
          getManager().save(Banner_Hist, banner);
        }

        if (oldData.message !== newData.message) {
          const banner = {
            _id: event.entity.id,
            action: ACTION_TYPE.UPDATE,
            name: 'Notification banner',
            modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
            newData: newData.message,
            update: 'message',
            oldData: oldData.message,
            clientID: newData.client.id,
            version,
          };
          getManager().save(Banner_Hist, banner);
        }

        if (oldData.type !== newData.type) {
          let newType = 'Info';
          let oldType = 'Info';
          if (newData.type === BANNER_TYPE.INFO) {
            newType = 'Info';
          }
          if (newData.type === BANNER_TYPE.ERROR) {
            newType = 'Error';
          }
          if (newData.type === BANNER_TYPE.WARNING) {
            newType = 'Warning';
          }

          if (oldData.type === BANNER_TYPE.INFO) {
            oldType = 'Info';
          }
          if (oldData.type === BANNER_TYPE.ERROR) {
            oldType = 'Error';
          }
          if (oldData.type === BANNER_TYPE.WARNING) {
            oldType = 'Warning';
          }
          const banner = {
            _id: event.entity.id,
            action: ACTION_TYPE.UPDATE,
            name: 'Notification banner',
            modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
            newData: newType,
            update: 'type',
            oldData: oldType,
            clientID: newData.client.id,
            version,
          };
          getManager().save(Banner_Hist, banner);
        }

        if (oldData.status !== newData.status) {
          const banner = {
            _id: event.entity.id,
            action: ACTION_TYPE.UPDATE,
            name: 'Notification banner',
            modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
            newData: newData.status.toString(),
            update: 'status',
            oldData: oldData.status.toString(),
            clientID: newData.client.id,
            version,
          };
          getManager().save(Banner_Hist, banner);
        }
        if (
          new Date(oldData.launchDate).toString() !==
          new Date(newData.launchDate).toString()
        ) {
          const banner = {
            _id: event.entity.id,
            action: ACTION_TYPE.UPDATE,
            name: 'Notification banner',
            modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
            newData: new Date(newData.launchDate).toString(),
            update: 'launchDate',
            oldData: new Date(oldData.launchDate).toString(),
            clientID: newData.client.id,
            version,
          };
          getManager().save(Banner_Hist, banner);
        }

        if (
          new Date(oldData.expirationDate).toString() !==
          new Date(newData.expirationDate).toString()
        ) {
          const banner = {
            _id: event.entity.id,
            action: ACTION_TYPE.UPDATE,
            name: 'Notification banner',
            modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
            newData: new Date(newData.expirationDate).toString(),
            update: 'expirationDate',
            oldData: new Date(oldData.expirationDate).toString(),
            clientID: newData.client.id,
            version,
          };
          getManager().save(Banner_Hist, banner);
        }
      }
    })();
  }
}
