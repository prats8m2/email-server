import { getManager, getCustomRepository } from 'typeorm';
import { Dictionary_Hist } from '../../../db/entity/dictionary_hist.entity';
import { ACTION_TYPE } from '../../../../config/config';
import { UserRepository } from '../../repository/user';
const addLogsForDictionary = async (
  clientId: string,
  value: boolean,
  modifiedBy: string,
  oldData: any
) => {
  const userRepo = getCustomRepository(UserRepository);
  const userData = await userRepo.getUser({ id: modifiedBy });

  const dictionaryData = await getManager().find(Dictionary_Hist, {
    where: { clientID: clientId },
  });
  const dictionary = {
    action: ACTION_TYPE.UPDATE,
    name: 'Dictionary',
    modifiedBy: `${userData?.firstName} ${userData?.lastName}`,
    newData:
      typeof value === 'boolean'
        ? value
          ? 'Enabled'
          : 'Disabled'
        : value
        ? 'WHO_' + value
        : 'Disabled',
    update: typeof value === 'boolean' ? 'MedDRA' : 'WHO',
    oldData:
      typeof oldData === 'boolean'
        ? oldData
          ? 'Enabled'
          : 'Disabled'
        : oldData
        ? 'WHO_' + oldData
        : 'Disabled',
    clientID: clientId,
    version: dictionaryData.length + 1,
  };
  getManager().save(Dictionary_Hist, dictionary);
};

export default addLogsForDictionary;
