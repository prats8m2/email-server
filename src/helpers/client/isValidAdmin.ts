import { ROLES, MAX_ROW } from '../../../config/config';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../repository/client';

const isValidAdmin = async (
  id: string,
  loggedInId: string,
  loggedInRole: string
) => {
  if (loggedInRole !== ROLES.SUPER_ADMIN) {
    if (loggedInRole === ROLES.ADMIN) {
      const clientRepo = getCustomRepository(ClientRepository);
      const [allClients, clientLength] = await clientRepo.getAllClientByAdmin(
        MAX_ROW,
        1,
        loggedInId
      );

      for (let index = 0; index < clientLength; index++) {
        const clientId = allClients[index].id;
        if (clientId === id) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export default isValidAdmin;
