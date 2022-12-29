// Library imports
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// File imports
// Route imports for version 1

import siteRoutesV1 from './v1/routes/site.routes';
import clientRoutesV1 from './v1/routes/client.routes';
import adminRoutesV1 from './v1/routes/admin.routes';
import loginRoutesV1 from './v1/routes/login.routes';
import roleRoutesV1 from './v1/routes/role.routes';
import userRoutesV1 from './v1/routes/user.routes';
import dashboardRoutesV1 from './v1/routes/dashboard.routes';
import bannerRoutesV1 from './v1/routes/banner.routes';

//Routes import for version 2

import siteRoutesV2 from './routes/site.routes';
import clientRoutesV2 from './routes/client.routes';
import adminRoutesV2 from './routes/admin.routes';
import loginRoutesV2 from './routes/login.routes';
import roleRoutesV2 from './routes/role.routes';
import userRoutesV2 from './routes/user.routes';
import dashboardRoutesV2 from './routes/dashboard.routes';
import bannerRoutesV2 from './routes/banner.routes';
import connectionRoutes from './routes/connection.routes';

import Database from './db';
import swaggerDocument from '../swagger/swagger.json';

class Server {
  private app;

  constructor() {
    this.app = express();
    this.config();
    this.routerConfig();
    this.databaseConfig();
    this.swaggerConfig();
  }

  // Configuration
  private config() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
    this.app.use(
      cors({
        // disable CORS
        origin: '*',
      })
    );
  }

  // Routes

  private routerConfig() {
    //v1 routes

    this.app.use('/api/v1/login', loginRoutesV1);
    this.app.use('/api/v1/site', siteRoutesV1);
    this.app.use('/api/v1/client', clientRoutesV1);
    this.app.use('/api/v1/admin', adminRoutesV1);
    this.app.use('/api/v1/role', roleRoutesV1);
    this.app.use('/api/v1/user', userRoutesV1);
    this.app.use('/api/v1/dashboard', dashboardRoutesV1);
    this.app.use('/api/v1/banner', bannerRoutesV1);
    //v2 routes
    this.app.use('/api/v2/login', loginRoutesV2);
    this.app.use('/api/v2/site', siteRoutesV2);
    this.app.use('/api/v2/client', clientRoutesV2);
    this.app.use('/api/v2/admin', adminRoutesV2);
    this.app.use('/api/v2/role', roleRoutesV2);
    this.app.use('/api/v2/user', userRoutesV2);
    this.app.use('/api/v2/dashboard', dashboardRoutesV2);
    this.app.use('/api/v2/banner', bannerRoutesV2);
    //server configuration routes
    this.app.use('/api/v2', connectionRoutes);
  }

  //database
  private databaseConfig() {
    const db = new Database();
    db.connect();
  }

  // Swagger
  private swaggerConfig() {
    const options = {
      customCssUrl: '../swagger/swagger.css',
      authAction: {
        JWT: {
          name: 'JWT',
          schema: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: '',
          },
          value: 'Bearer <JWT>',
        },
      },
    };
    this.app.use(
      '/swagger/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, options)
    );
  }

  // Server
  public start = (port: number) => {
    return new Promise((resolve, reject) => {
      this.app
        .listen(port, () => {
          resolve(port);
        })
        .on('error', (err: object) => reject(err));
    });
  };
}

export default Server;
