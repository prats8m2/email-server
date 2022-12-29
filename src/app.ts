import server from './server';
import { SERVER_PORT } from '../config/config';
import Logger from './utility/logger';

// Server starter
const starter = new server()
  .start(SERVER_PORT)
  .then(() => {
    Logger.info(`Server started on port ${SERVER_PORT}. Happy Developing!`);
  })
  .catch(error => {
    Logger.error(`Server Down => ${error}`);
  });

export default starter;
