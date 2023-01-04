// Library imports
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// File imports

//Routes import for version 2

import appRoutes from './routes/app.routes';

class Server {
  private app;

  constructor() {
    this.app = express();
    this.config();
    this.routerConfig();
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
    this.app.use('/api', appRoutes);
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
