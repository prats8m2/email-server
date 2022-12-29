import { ClientI } from '../client/client';
import { RoleI } from '../role/role';

export interface SiteI {
  id?: string;
  name: string;
  ip: string;
  port: number;
  url: string;
  username: string;
  password?: string;
  type: number;
  status: number;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  clients?: ClientI[];
  roles?: RoleI[];
}
