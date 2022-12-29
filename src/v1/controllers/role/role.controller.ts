import { Request, Response } from 'express';
import addRole from './addRole';
import updateRole from './updateRole';
import deleteRole from './deleteRole';
import listRole from './listRole';
import listRoleForAdmin from './listRoleForAdmin';
import listFolder from './listFolder';
class RoleController {
  public add = async (req: Request, res: Response) => {
    addRole(req, res);
  };

  public update = async (req: Request, res: Response) => {
    updateRole(req, res);
  };

  public delete = async (req: Request, res: Response) => {
    deleteRole(req, res);
  };

  public list = async (req: Request, res: Response) => {
    listRole(req, res);
  };

  public folder = async (req: Request, res: Response) => {
    listFolder(req, res);
  };

  public listRoleForAdmin = async (req: Request, res: Response) => {
    listRoleForAdmin(req, res);
  };
}

export default RoleController;
