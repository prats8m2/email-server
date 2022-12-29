import { Request, Response } from 'express';
import changePassword from './changePassword';
import addUser from './addUser';
import updateUser from './updateUser';
import viewUser from './viewUser';
import listUser from './listUser';
import deleteUser from './deleteUser';
import getProfile from './getProfile';
import updateProfile from './updateProfile';
import getAssignedFolder from './getAssignedFolder';

class UserController {
  public add = async (req: Request, res: Response) => {
    addUser(req, res);
  };

  public update = async (req: Request, res: Response) => {
    updateUser(req, res);
  };

  public view = async (req: Request, res: Response) => {
    viewUser(req, res);
  };

  public getProfile = async (req: Request, res: Response) => {
    getProfile(req, res);
  };

  public list = async (req: Request, res: Response) => {
    listUser(req, res);
  };

  public delete = async (req: Request, res: Response) => {
    deleteUser(req, res);
  };
  public changePassword = async (req: Request, res: Response) => {
    changePassword(req, res);
  };

  public updateProfile = async (req: Request, res: Response) => {
    updateProfile(req, res);
  };

  public getAssignedFolder = async (req: Request, res: Response) => {
    getAssignedFolder(req, res);
  };
}

export default UserController;
