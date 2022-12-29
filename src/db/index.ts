import { createConnection } from 'typeorm';
import { User } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { DB_CONFIG, DEFAULT_SUPER_ADMIN_CREDS } from '../../config/config';
import Logger from '../utility/logger';
import { Client } from './entity/client.entity';
import { ClientConfig } from './entity/clientConfig.entity';
import { Site } from './entity/site.entity';
import { Enterprise } from './entity/enterprise.entity';
import { Folder } from './entity/folder.entity';
import { SiteSubscriber } from './subscriptions/site.sub';
import { Site_Hist } from './entity/site_hist.entity';
import { Client_Hist } from './entity/client_hist.entity';
import { ClientSubscriber } from './subscriptions/client.sub';
import { User_Hist } from './entity/user_hist.entity';
import { Role_Hist } from './entity/role_hist.entity';
import { ClientConfig_Hist } from './entity/clientConfig_hist.entity';
// import { UserSubscriber } from "./subscriptions/user.sub";
import { RoleSubscriber } from './subscriptions/role.sub';
import { ClientConfigSubscriber } from './subscriptions/clientConfig.sub';
import { Banner } from './entity/banner.entity';
import { BannerSubscriber } from './subscriptions/banner.sub';
import { Banner_Hist } from './entity/banner_hist.entity';
import { Dictionary_Hist } from './entity/dictionary_hist.entity';
import { UserI } from '../interface/user/user';
import onboardDatabase from '../helpers/admin/onboardDatabase';

class Database {
  public connect = () => {
    // Initialize a connection pool against the database.
    createConnection({
      type: 'postgres',
      host: DB_CONFIG.host,
      port: parseInt(DB_CONFIG.port, 10),
      database: DB_CONFIG.database,
      username: DB_CONFIG.user,
      password: DB_CONFIG.password,
      entities: [
        User,
        Role,
        Client,
        ClientConfig,
        Site,
        Enterprise,
        Folder,
        Banner,
        Site_Hist,
        Client_Hist,
        User_Hist,
        Role_Hist,
        ClientConfig_Hist,
        Banner_Hist,
        Dictionary_Hist,
      ],
      subscribers: [
        SiteSubscriber,
        ClientSubscriber,
        // UserSubscriber,
        RoleSubscriber,
        ClientConfigSubscriber,
        BannerSubscriber,
      ],
      migrationsTableName: 'user',
      migrations: ['/migrations/*.ts'],
      logging: DB_CONFIG.logging === 'true',
      synchronize: DB_CONFIG.sync === 'true',
      cli: {
        entitiesDir: 'src/db/entity',
        migrationsDir: 'src/migrations',
      },
    })
      .then(async (connection: any) => {
        //Check if data is empty create super admin
        const user: UserI[] = await connection.manager.query(
          `Select * from "user"`
        );
        if (user.length === 0) {
          onboardDatabase(
            DEFAULT_SUPER_ADMIN_CREDS.USER_NAME,
            DEFAULT_SUPER_ADMIN_CREDS.PASSWORD,
            DEFAULT_SUPER_ADMIN_CREDS.EMAIL,
            DEFAULT_SUPER_ADMIN_CREDS.FIRST_NAME,
            DEFAULT_SUPER_ADMIN_CREDS.LAST_NAME
          );
        }
        if (DB_CONFIG.clear === 'true') {
          Logger.info('Initiating Database refresh...');
          await this.clearDB(connection);
        }

        Logger.http(`${DB_CONFIG.database} Database Connected!`);
        console.log(`DB URL: ${DB_CONFIG.host}`);
      })
      .catch(error => {
        console.log(error);
      });
  };

  private clearDB = async (connection: any) => {
    await connection.manager.query(
      `Truncate Table
      "site_hist", "client_hist","user_hist","client_config_hist","role_hist",
       "enterprise","banner", "client_config","site","client_sites_site",
       "client", "user_roles_role", "user","role_folders_folder", "folder", "role"`
    );
    onboardDatabase(
      DEFAULT_SUPER_ADMIN_CREDS.USER_NAME,
      DEFAULT_SUPER_ADMIN_CREDS.PASSWORD,
      DEFAULT_SUPER_ADMIN_CREDS.EMAIL,
      DEFAULT_SUPER_ADMIN_CREDS.FIRST_NAME,
      DEFAULT_SUPER_ADMIN_CREDS.LAST_NAME
    );
  };
}

export default Database;
