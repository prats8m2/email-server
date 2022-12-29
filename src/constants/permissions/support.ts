import { PermissionsI } from '../../interface/role/permissions';

const SUPPORT_PERMISSIONS: PermissionsI = {
  BI: [
    {
      name: 'viewReport',
      displayName: 'View Reports',
      status: true,
    },
    {
      name: 'readReport',
      displayName: 'Read Reports',
      status: true,
    },
    {
      name: 'writeReport',
      displayName: 'Write Reports',
      status: true,
    },
    {
      name: 'executeReport',
      displayName: 'Execute Reports',
      status: true,
    },
    {
      name: 'editReport',
      displayName: 'Edit Reports',
      status: false,
    },
    {
      name: 'scheduleReport',
      displayName: 'Schedule Reports',
      status: true,
    },
    {
      name: 'deleteReport',
      displayName: 'Delete Reports',
      status: false,
    },
  ],
  UI: [
    {
      name: 'profile',
      displayName: 'Profile',
      status: true,
    },
    {
      name: 'dashboard',
      displayName: 'Dashboard',
      status: true,
    },
    {
      name: 'site',
      displayName: 'Site',
      status: false,
    },
    {
      name: 'clients',
      displayName: 'Client',
      status: false,
    },
    {
      name: 'client-admin',
      displayName: 'Client Admin',
      status: false,
    },
    {
      name: 'roles',
      displayName: 'Role',
      status: false,
    },
    {
      name: 'users',
      displayName: 'User',
      status: false,
    },
    {
      name: 'audit-log',
      displayName: 'Audit logs',
      status: false,
    },
    {
      name: 'app-settings',
      displayName: 'App Settings',
      status: false,
    },
    {
      name: 'reports',
      displayName: 'Reports',
      status: true,
    },
  ],
};

export default SUPPORT_PERMISSIONS;
