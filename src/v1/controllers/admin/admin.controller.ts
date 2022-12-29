import { Request, Response } from 'express';
import addAdmin from './addAdmin';
import updateAdmin from './updateAdmin';
import viewAdmin from './viewAdmin';
import listAdmin from './listAdmin';
import deleteAdmin from './deleteAdmin';
import addSuperAdmin from './addSuperAdmin';

class adminController {
  public add = async (req: Request, res: Response) => {
    addAdmin(req, res);
  };

  public addSuperAdmin = async (req: Request, res: Response) => {
    console.log('Adding');
    addSuperAdmin(req, res);
  };

  public update = async (req: Request, res: Response) => {
    updateAdmin(req, res);
  };

  public view = async (req: Request, res: Response) => {
    viewAdmin(req, res);
  };

  public list = async (req: Request, res: Response) => {
    listAdmin(req, res);
  };

  public delete = async (req: Request, res: Response) => {
    deleteAdmin(req, res);
  };
}

export default adminController;
