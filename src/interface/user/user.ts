import { RoleI } from '../role/role';
import { EnterpriseI } from '../enterprise/enterprise';

export interface UserI {
  id?: string;
  username: string;
  firstName: string;
  email: string;
  password?: string;
  lastName?: string;
  authToken?: string;
  token?: string;
  tokenExpiration?: number;
  status?: number;
  lastLogin?: number;
  isTempPass?: boolean;
  mobile?: string;
  isFirstLogin?: boolean;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  roles?: RoleI[];
  enterprises?: EnterpriseI[];
}
