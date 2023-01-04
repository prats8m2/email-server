import server from './server';
import { SERVER_PORT } from '../config/config';

// Server starter
const starter = new server()
  .start(SERVER_PORT)
  .then(() => {
    console.log(`Server started on port ${SERVER_PORT}. Happy Developing!`);
  })
  .catch(error => {
    console.error(`Server Down => ${error}`);
  });

export default starter;
