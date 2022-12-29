import { PermissionsI } from '../../interface/role/permissions';

const ADMIN_PERMISSIONS: PermissionsI = {
  BI: [
    {
      name: 'publish',
      displayName: 'Publish',
      status: true,
    },
    {
      name: 'advance',
      displayName: 'Advance',
      status: true,
    },
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
      name: 'editReport',
      displayName: 'Edit Reports',
      status: true,
    },
    {
      name: 'executeReport',
      displayName: 'Execute Reports',
      status: true,
    },
    {
      name: 'deleteReport',
      displayName: 'Delete Reports',
      status: true,
    },
    {
      name: 'scheduleReport',
      displayName: 'Schedule Reports',
      status: true,
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
      status: true,
    },
    {
      name: 'client-admin',
      displayName: 'Client Admin',
      status: false,
    },
    {
      name: 'roles',
      displayName: 'Role',
      status: true,
    },
    {
      name: 'users',
      displayName: 'User',
      status: true,
    },
    {
      name: 'app-settings',
      displayName: 'App Settings',
      status: true,
    },
    {
      name: 'audit-log',
      displayName: 'Audit logs',
      status: true,
    },
    {
      name: 'reports',
      displayName: 'Reports',
      status: true,
    },
  ],
};

export default ADMIN_PERMISSIONS;
