import { ROLES } from '../../config/config';
import { EntityRepository, AbstractRepository, Not } from 'typeorm';
import { User } from '../db/entity/user.entity';
import { UserI } from '../interface/user/user';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  //function to create user in the DB
  createUser = (user: UserI) => {
    const newUser = this.manager.create(User, user);
    return this.manager.save(newUser);
  };

  //function to update user
  updateUser = (user: UserI) => {
    return this.manager.save(User, user) ?? null;
  };

  updatePassword = (password: string, updatedBy: string, id: string) => {
    return this.repository
      .createQueryBuilder()
      .update(User)
      .set({ password, updatedBy, token: null })
      .where('id = :id', { id })
      .execute();
  };
  //function to fetch single user
  getUser = (where: any) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role')
        .where(where)
        .getOne() ?? null
    );
  };

  //function to delete the user
  removeUser = (where: any) => {
    return this.manager.softDelete(User, where);
  };

  //function to get all admin details
  getUserDetails = async (where: any) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role')
        .innerJoinAndSelect('Role.site', 'Site')
        .innerJoinAndSelect('Role.client', 'Client')
        .innerJoinAndSelect('Client.config', 'ClientConfig')
        // .innerJoinAndSelect("Role.folders", "Folder")
        .innerJoinAndSelect('user.enterprises', 'Enterprise')
        .where(where)
        .getOne() ?? null
    );
  };

  getProfile = async (where: any) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role')
        .where(where)
        .getOne() ?? null
    );
  };

  //function to get all user of a particular site & client
  getAllUser = async (
    row: any,
    page: any,
    clientId: string,
    siteId: string
  ) => {
    const result = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'Role')
      .leftJoinAndSelect('Role.client', 'Client')
      .leftJoinAndSelect('Role.site', 'Site')
      .innerJoinAndSelect('user.enterprises', 'Enterprise')
      .skip((page - 1) * row)
      .take(row)
      .where('Role.name != :role1 AND Role.name != :role2', {
        role1: ROLES.SUPER_ADMIN,
        role2: ROLES.ADMIN,
      })
      .andWhere('Client.id = :clientId', {
        clientId,
      })
      .andWhere('Site.id = :siteId', {
        siteId,
      })
      .getManyAndCount();
    return result ?? null;
  };

  /*
      #
     # #   #####  #    # # #    #
    #   #  #    # ##  ## # ##   #
   #     # #    # # ## # # # #  #
   ####### #    # #    # # #  # #
   #     # #    # #    # # #   ##
   #     # #####  #    # # #    #

  */

  //function to fetch single admin
  getAdmin = (where: any) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role', 'Role.name = :adminRole', {
          adminRole: ROLES.ADMIN,
        })
        .where(where)
        .getOne() ?? null
    );
  };

  getAdminWithPass = (where: any) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role', 'Role.name = :adminRole', {
          adminRole: ROLES.ADMIN,
        })
        .select(['user', 'user.password', 'Role'])
        .where(where)
        .getOne() ?? null
    );
  };

  //function to fetch single admin
  getAdminDetails = (where: any) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role', 'Role.name = :adminRole', {
          adminRole: ROLES.ADMIN,
        })
        .leftJoinAndSelect('Role.client', 'Client')
        .leftJoinAndSelect('Role.site', 'Site')
        .where(where)
        .getOne() ?? null
    );
  };

  //function to get all admins
  getAllAdmin = async (row: any, page: any) => {
    const result = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'Role')
      .leftJoinAndSelect('Role.client', 'Client')
      .leftJoinAndSelect('Role.site', 'Site')
      .skip((page - 1) * row)
      .take(row)
      .where('Role.name = :adminRole', {
        adminRole: ROLES.ADMIN,
      })
      .getManyAndCount();
    return result ?? null;
  };

  /*
   #       #######  #####  ### #     #
   #       #     # #     #  #  ##    #
   #       #     # #        #  # #   #
   #       #     # #  ####  #  #  #  #
   #       #     # #     #  #  #   # #
   #       #     # #     #  #  #    ##
   ####### #######  #####  ### #     #

  */

  //function to fetch single admin
  authenticate = (account: string, username: string, password: string) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role')
        .innerJoinAndSelect('Role.client', 'Client')
        .where({ username, password })
        .andWhere('Role.accountName = :account', { account })
        .getOne() ?? null
    );
  };

  authenticateAdmin = (account: string, username: string, password: string) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role')
        .where({ username, password })
        .andWhere('Role.accountName = :account', { account })
        .getOne() ?? null
    );
  };

  ifUserExist = (account: string, username: string, email: string) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role')
        .leftJoinAndSelect('user.enterprises', 'Enterprise')
        .where({ username, email })
        .andWhere('Role.accountName = :account', { account })
        .getOne() ?? null
    );
  };

  ifUserExistUpdate = (account: string, username: string, id: string) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role')
        .where({ username, id: Not(id) })
        .andWhere('Role.accountName = :account', { account })
        .getOne() ?? null
    );
  };

  getSuperAdmin = (where: any) => {
    return (
      this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'Role', 'Role.name = :adminRole', {
          adminRole: ROLES.SUPER_ADMIN,
        })
        .where(where)
        .getOne() ?? null
    );
  };
}
