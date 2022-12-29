import { RoleI } from './role';
export interface FolderI {
  id?: string;
  name?: string;
  path?: string;
  role?: RoleI;
  status?: number;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
