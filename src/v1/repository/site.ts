import { EntityRepository, AbstractRepository } from 'typeorm';
import { Site } from '../../db/entity/site.entity';

@EntityRepository(Site)
export class SiteRepository extends AbstractRepository<Site> {
  //function to create site in the DB
  createSite = (site: any) => {
    const newSite = this.manager.create(Site, site);
    return this.manager.save(newSite);
  };

  //function to update site
  updateSite = (site: any) => {
    return this.manager.save(Site, site);
  };

  //function to fetch single site
  getSite = (where: any) => {
    return this.manager.findOne(Site, {
      select: ['ip', 'port', 'username', 'password', 'type', 'url'],
      where,
    });
  };

  //function to delete the site
  removeSite = (where: any) => {
    return this.manager.softDelete(Site, where);
  };

  //function to get all admin details
  getSiteDetails = async (where: any) => {
    return (
      this.repository
        .createQueryBuilder('site')
        .leftJoinAndSelect('site.clients', 'Client')
        .select([
          'site.id',
          'site.username',
          'site.password',
          'site.port',
          'site.type',
          'site.ip',
          'site.name',
          'site.url',
          'Client.name',
        ])
        .andWhere(where)
        .getOne() ?? null
    );
  };

  //function to get all sites
  getAllSite = async (row: any, page: any) => {
    const result = this.repository
      .createQueryBuilder('site')
      .leftJoinAndSelect('site.clients', 'Client')
      .select([
        'site.id',
        'site.username',
        'site.password',
        'site.port',
        'site.ip',
        'site.name',
        'site.url',
        'Client',
      ])
      .skip((page - 1) * row)
      .take(row)
      .getManyAndCount();
    return result ?? null;
  };

  //function to get all sites
  getAllSiteDetail = async () => {
    const result = this.repository
      .createQueryBuilder('site')
      .leftJoinAndSelect('site.clients', 'Client')
      .select([
        'site.id',
        'site.username',
        'site.password',
        'site.port',
        'site.ip',
        'site.name',
        'site.url',
        'Client',
      ])
      .getMany();
    return result ?? null;
  };

  //function to get all sites
  getAllReports = async () => {
    return (
      this.repository
        .createQueryBuilder('site')
        .innerJoinAndSelect('site.clients', 'Client')
        .select([
          'site.id',
          'site.username',
          'site.password',
          'site.port',
          'site.ip',
          'site.name',
          'site.url',
          'Client.name',
        ])
        .getManyAndCount() ?? null
    );
  };

  getAllReportForSuperAdmin = async () => {
    return (
      this.repository
        .createQueryBuilder('site')
        .select([
          'site.id',
          'site.username',
          'site.password',
          'site.port',
          'site.ip',
          'site.name',
          'site.url',
        ])
        .getManyAndCount() ?? null
    );
  };

  getAllReportsByUser = (id: string) => {
    return (
      this.repository
        .createQueryBuilder('site')
        .innerJoinAndSelect('site.roles', 'Role')
        .leftJoinAndSelect('Role.users', 'User')
        .leftJoinAndSelect('Role.client', 'Client')
        .select([
          'site.id',
          'site.username',
          'site.password',
          'site.port',
          'site.ip',
          'site.name',
          'site.url',
          'Client.name',
          'Role.accountName',
        ])
        .andWhere('User.id = :id', { id })
        .getManyAndCount() ?? null
    );
  };

  getAllSiteByUser = (id: string) => {
    return (
      this.repository
        .createQueryBuilder('site')
        .innerJoinAndSelect('site.roles', 'Role')
        .leftJoinAndSelect('Role.users', 'User')
        .leftJoinAndSelect('Role.client', 'Client')
        .select([
          'site.id',
          'site.username',
          'site.password',
          'site.port',
          'site.ip',
          'site.name',
          'site.url',
          'Client.name',
          'Role.accountName',
        ])
        .andWhere('User.id = :id', { id })
        .getManyAndCount() ?? null
    );
  };

  getAllSiteByUserWithDeleted = (id: string) => {
    return (
      this.repository
        .createQueryBuilder('site')
        .innerJoinAndSelect('site.roles', 'Role')
        .leftJoinAndSelect('Role.users', 'User')
        .leftJoinAndSelect('Role.client', 'Client')
        .select([
          'site.id',
          'site.username',
          'site.password',
          'site.port',
          'site.ip',
          'site.name',
          'site.url',
          'Client.name',
          'Role.accountName',
        ])
        .andWhere('User.id = :id', { id })
        .getManyAndCount() ?? null
    );
  };
}
