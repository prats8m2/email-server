import { ROLES, STATUS } from '../../config/config';
import { EntityRepository, AbstractRepository, Not } from 'typeorm';
import { RoleI } from '../interface/role/role';
import { Role } from '../db/entity/role.entity';
import { FolderI } from '../interface/role/folder';
import { Folder } from '../db/entity/folder.entity';

@EntityRepository(Role)
export class RoleRepository extends AbstractRepository<Role> {
  //function to create role in the DB
  createRole = (role: RoleI) => {
    const newRole = this.manager.create(Role, role);
    return this.manager.save(newRole);
  };

  //function to create role in the DB
  createFolder = (folder: FolderI) => {
    const newFolder = this.manager.create(Folder, folder);
    return this.manager.save(newFolder);
  };
  //function to fetch single role
  getAllFolder = () => {
    return this.manager.find(Folder);
  };
  //function to update role
  updateRole = (role: RoleI) => {
    return this.manager.save(Role, role) ?? null;
  };

  //function to fetch single role
  getRole = (where: any) => {
    return this.manager.findOne(Role, { where });
  };

  //function to delete the role
  removeRole = (where: any) => {
    return this.manager.softDelete(Role, where);
  };

  //function to delete the role
  deleteRole = (where: any) => {
    return this.manager.delete(Role, { where });
  };

  //function to get all admin details
  getRoleDetails = async (where: object) => {
    return (
      this.repository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.users', 'User')
        .leftJoinAndSelect('role.client', 'Client')
        .leftJoinAndSelect('role.site', 'Site')
        .select(['role', 'Client', 'Site', 'User', 'Site.password'])
        .where(where)
        .getOne() ?? null
    );
  };

  //function to get all admin details
  getClientConfigByRole = async (where: object) => {
    return (
      this.repository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.client', 'Client')
        .leftJoinAndSelect('role.site', 'Site')
        .innerJoin('Client.config', 'ClientConfig')
        .select(['role', 'Client', 'Site', 'ClientConfig', 'Site.password'])
        .where(where)
        .getOne() ?? null
    );
  };

  //function to get all admins
  getAllAdmin = async (row: any, page: any) => {
    const result = this.manager.findAndCount(Role, {
      where: {
        roles: {
          name: ROLES.ADMIN,
        },
      },
      order: {
        name: 'DESC',
      },
      skip: (page - 1) * row,
      take: row,
    });
    return result ?? null;
  };

  //function to get all role of a particular site & client
  getAllRole = async (clientId: string, siteId: string) => {
    const result = this.repository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.folders', 'Folder')
      .where({
        client: clientId,
        site: siteId,
        name: Not(ROLES.ADMIN),
      })
      .orderBy({
        'role.createdOn': 'ASC',
      })
      .getManyAndCount();
    return result ?? null;
  };

  //function to get all roles for admin
  getAllRoleOfAdmin = async () => {
    return (
      this.repository
        .createQueryBuilder('role')
        .innerJoinAndSelect('role.client', 'Client')
        .andWhere('Role.name = :role AND Client.status = :status', {
          role: ROLES.ADMIN,
          status: STATUS.ACTIVE,
        })
        .getManyAndCount() ?? null
    );
  };
}
