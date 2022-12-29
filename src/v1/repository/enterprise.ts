import { EntityRepository, AbstractRepository } from 'typeorm';
import { Enterprise } from '../../db/entity/enterprise.entity';
import { EnterpriseI } from '../interface/enterprise/enterprise';

@EntityRepository(Enterprise)
export class EnterpriseRepository extends AbstractRepository<Enterprise> {
  //function to create enterprise in the DB
  createEnterprise = (enterprise: EnterpriseI) => {
    const newEnterprise = this.manager.create(Enterprise, enterprise);
    return this.manager.save(newEnterprise);
  };

  //function to update enterprise
  updateEnterprise = (enterprise: EnterpriseI) => {
    return this.manager.save(Enterprise, enterprise);
  };

  //function to fetch single enterprise
  getEnterprise = (where: any) => {
    return this.manager.findOne(Enterprise, { where });
  };

  //function to delete the enterprise
  removeEnterprise = (where: any) => {
    return this.manager.softDelete(Enterprise, where);
  };

  //function to get all admin details
  getEnterpriseDetails = async (where: any) => {
    const result: EnterpriseI = await this.manager.findOne(Enterprise, {
      relations: ['client', 'user'],
      where,
    });
    return result ?? null;
  };

  //function to get all enterprises
  getAllEnterprise = async (where: any) => {
    const result = this.manager.findAndCount(Enterprise, {
      relations: ['client', 'user'],
      order: {
        id: 'DESC',
      },
      where,
    });
    return result ?? null;
  };

  //function to get all enterprises
  getAllEnterpriseByUser = async (userId: string) => {
    const result = this.repository
      .createQueryBuilder('enterprise')
      .innerJoinAndSelect('enterprise.client', 'Client')
      .leftJoinAndSelect('Client.sites', 'Site', 'Site.type = :reporting', {
        reporting: 1,
      })
      .distinctOn(['enterprise.client'])
      .where('enterprise.user = :userId', {
        userId: userId,
      })
      .getMany();
    return result ?? null;
  };
}
