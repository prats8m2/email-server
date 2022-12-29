import { PermissionsI } from '../../interface/role/permissions';

const DEFAULT_PERMISSIONS: PermissionsI = {
  BI: [
    {
      name: 'viewReport',
      displayName: 'View Reports',
      status: false,
    },
    {
      name: 'readReport',
      displayName: 'Read Reports',
      status: false,
    },
    {
      name: 'writeReport',
      displayName: 'Write Reports',
      status: false,
    },
    {
      name: 'executeReport',
      displayName: 'Execute Reports',
      status: false,
    },
    {
      name: 'editReport',
      displayName: 'Edit Reports',
      status: false,
    },
    {
      name: 'scheduleReport',
      displayName: 'Schedule Reports',
      status: false,
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
      name: 'app-settings',
      displayName: 'App Settings',
      status: false,
    },
    {
      name: 'audit-log',
      displayName: 'Audit logs',
      status: false,
    },
    {
      name: 'reports',
      displayName: 'Reports',
      status: true,
    },
  ],
};

export default DEFAULT_PERMISSIONS;
