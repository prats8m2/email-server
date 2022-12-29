import { ClientI } from '../client/client';
import { UserI } from '../user/user';

export interface EnterpriseI {
  id?: string;
  client: ClientI;
  user: UserI;
  enterpriseID: number;
  enterpriseName?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
