import { EntityRepository, AbstractRepository } from 'typeorm';
import { Client } from '../db/entity/client.entity';
import { ClientI } from '../interface/client/client';

@EntityRepository(Client)
export class ClientRepository extends AbstractRepository<Client> {
  //function to create client in the DB
  createClient = (client: ClientI) => {
    const newClient = this.manager.create(Client, client);
    return this.manager.save(newClient);
  };

  //function to update client
  updateClient = (client: ClientI) => {
    return this.manager.save(Client, client);
  };

  //function to fetch single client
  getClient = (where: any) => {
    return this.manager.findOne(Client, { where });
  };

  //function to delete the client
  removeClient = (where: any) => {
    return this.manager.softDelete(Client, where);
  };

  //function to get all admin details
  getClientDetails = async (where: any) => {
    return (
      this.repository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.sites', 'Site')
        .leftJoinAndSelect('client.roles', 'Role')
        .leftJoinAndSelect('client.config', 'ClientConfig')
        .select([
          'Site.password',
          'Site.url',
          'client',
          'Site',
          'Role',
          'ClientConfig',
        ])
        .where(where)
        .getOne() ?? null
    );
  };

  //function to get all clients
  getAllClient = async (row: any, page: any, status = 'undefined') => {
    if (status != null && status != 'undefined') {
      const result = this.manager.findAndCount(Client, {
        relations: ['sites'],
        order: {
          name: 'DESC',
        },
        where: {
          status,
        },
        skip: (page - 1) * row,
        take: row,
      });
      return result ?? null;
    } else {
      const result = this.manager.findAndCount(Client, {
        relations: ['sites'],
        order: {
          name: 'DESC',
        },
        skip: (page - 1) * row,
        take: row,
      });
      return result ?? null;
    }
  };

  //function to get all clients for client admin
  getAllClientByAdmin = async (
    row: any,
    page: any,
    adminId: string,
    status = 'undefined'
  ) => {
    if (status != null && status != 'undefined') {
      const result = this.repository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.sites', 'Site')
        .leftJoinAndSelect('client.roles', 'Role')
        .leftJoinAndSelect('Role.users', 'User')
        .where('User.id = :adminId AND client.status = :status', {
          adminId,
          status,
        })
        .skip((page - 1) * row)
        .take(row)
        .getManyAndCount();
      return result ?? null;
    } else {
      const result = this.repository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.sites', 'Site')
        .leftJoinAndSelect('client.roles', 'Role')
        .leftJoinAndSelect('Role.users', 'User')
        .where('User.id = :adminId', {
          adminId,
        })
        .skip((page - 1) * row)
        .take(row)
        .getManyAndCount();
      return result ?? null;
    }
  };
}
