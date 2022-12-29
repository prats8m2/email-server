import { UserI } from '../../interface/user/user';
import { getCustomRepository } from 'typeorm';
import SnowflakeService from '../../services/snowflake/snowflake';
import { USER_TYPE, ADMIN_ENTERPRISE_ID } from '../../../../config/config';
import { RoleI } from '../../interface/role/role';
import { RoleRepository } from '../../repository/role';
import DECRYPT from '../../utility/decrypt';
const updateAdminOnSnowflake = async (user: UserI, roles: RoleI[]) => {
  const newRoles: any[] = [];
  const oldRoles: any[] = [];

  for (let index = 0; index < roles.length; index++) {
    const role = roles[index];
    newRoles.push(role.id);
  }

  for (let index = 0; index < user.roles.length; index++) {
    const role = user.roles[index];
    oldRoles.push(role.id);
  }

  //filter out new enterprise ids to add
  const newRolesToAdd = newRoles.filter(x => !oldRoles.includes(x));
  //filter out old enterprise ids to remove
  const oldRolesToRemove = oldRoles.filter(x => !newRoles.includes(x));

  for (let index = 0; index < newRolesToAdd.length; index++) {
    const roleId = newRolesToAdd[index];
    const roleRepo = getCustomRepository(RoleRepository);
    const roleData = await roleRepo.getClientConfigByRole({ id: roleId });
    const client = roleData.client;
    const config = client.config;
    const snowflakeService = new SnowflakeService(
      config.snowflakeAccount,
      config.snowflakeUsername,
      DECRYPT(config.snowflakePassword),
      config.snowflakeDatabase,
      config.snowflakeRole,
      config.snowflakeWarehouse,
      true
    );

    snowflakeService.insertEnterprise(
      client.clientID,
      client.name,
      user.id,
      user.username,
      ADMIN_ENTERPRISE_ID,
      USER_TYPE.ADMIN,
      roleData.adminUsername
    );
  }

  for (let index = 0; index < oldRolesToRemove.length; index++) {
    const roleId = oldRolesToRemove[index];
    const roleRepo = getCustomRepository(RoleRepository);
    const roleData = await roleRepo.getClientConfigByRole({ id: roleId });
    const client = roleData.client;
    const config = client.config;
    const snowflakeService = new SnowflakeService(
      config.snowflakeAccount,
      config.snowflakeUsername,
      DECRYPT(config.snowflakePassword),
      config.snowflakeDatabase,
      config.snowflakeRole,
      config.snowflakeWarehouse,
      true
    );

    snowflakeService.removeEnterprise(
      client.clientID,
      user.id,
      ADMIN_ENTERPRISE_ID
    );
  }
};

export default updateAdminOnSnowflake;
