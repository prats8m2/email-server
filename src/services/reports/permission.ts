import { PermissionsI } from '../../interface/role/permissions';
export const mapPermission = (permissions: PermissionsI) => {
  const permissionArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let index = 0; index < permissions?.BI.length; index++) {
    const permission = permissions?.BI[index];
    // permissionArr += permission.status ? "1" : "0";
    if (permission.status) {
      const name = permission.name;

      switch (name) {
        case 'editReport':
          permissionArr[8] = 1;
          break;

        case 'deleteReport':
          permissionArr[5] = 1;
          break;

        case 'scheduleReport':
          permissionArr[4] = 1;
          permissionArr[1] = 1;
          break;

        case 'executeReport':
          permissionArr[3] = 1;
          permissionArr[1] = 1;
          break;

        case 'writeReport':
          permissionArr[2] = 1;
          permissionArr[1] = 1;
          break;

        case 'readReport':
          permissionArr[1] = 1;
          break;

        case 'viewReport':
          permissionArr[0] = 1;
      }
    }
  }

  return permissionArr.join('');
};

export const modifyPermission = (permissions: PermissionsI) => {
  for (let index = 0; index < permissions?.BI.length; index++) {
    const permission = permissions?.BI[index];
    if (permission.status) {
      const name = permission.name;
      if (name === 'executeReport') {
        permissions.BI[1].status = true;
      }
    }
  }

  return permissions;
};
