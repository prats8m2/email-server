import { UserI } from '../user/user';
import { ClientI } from '../client/client';
import { SiteI } from '../site/site';
import { PermissionsI } from './permissions';
import { FolderI } from './folder';
export interface RoleI {
  id?: string;
  name: string;
  permission: PermissionsI;
  accountName: string;
  adminUsername?: string;
  adminPassword?: string;
  status?: number;
  isDefault?: boolean;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  client?: ClientI;
  site?: SiteI;
  users?: UserI[];
  folders?: FolderI[];
}
