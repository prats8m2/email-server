import { ClientConfig } from '../../db/entity/clientConfig.entity';
import { EntityRepository, AbstractRepository } from 'typeorm';
import { ClientConfigI } from '../interface/client/clientConfig';

@EntityRepository(ClientConfig)
export class ClientConfigRepository extends AbstractRepository<ClientConfig> {
  //function to create site in the DB
  createClientConfig = () => {
    const newClientConfig = this.manager.create(ClientConfig);
    return this.manager.save(newClientConfig);
  };

  //function to update site
  updateClientConfig = (clientConfig: ClientConfigI) => {
    return this.manager.save(ClientConfig, clientConfig);
  };
}
