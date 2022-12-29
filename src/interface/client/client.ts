import { SiteI } from '../site/site';
import { EnterpriseI } from '../enterprise/enterprise';
import { RoleI } from '../role/role';
import { ClientConfigI } from './clientConfig';

export interface ClientI {
  id?: string;
  name: string;
  clientID: string;
  email: string;
  mobile?: string;
  address?: string;
  zipcode?: string;
  country?: string;
  contactName?: string;
  contactEmail?: string;
  contactMobile?: string;
  status?: number;
  isLatest?: boolean;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  sites?: SiteI[];
  roles?: RoleI[];
  enterprise?: EnterpriseI[];
  config?: ClientConfigI;
}
