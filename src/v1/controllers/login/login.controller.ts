import { Request, Response } from 'express';
import auth from '../login/auth';
import forgotPassword from './forgotPassword';
import resetPassword from './resetPassword';
import creds from './creds';
class clientController {
  public auth = async (req: Request, res: Response) => {
    auth(req, res);
  };

  public forgotPassword = async (req: Request, res: Response) => {
    forgotPassword(req, res);
  };

  public resetPassword = async (req: Request, res: Response) => {
    resetPassword(req, res);
  };

  public creds = async (req: Request, res: Response) => {
    creds(req, res);
  };
}

export default clientController;
