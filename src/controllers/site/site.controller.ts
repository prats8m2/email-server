import { Request, Response } from 'express';
import addSite from './addSite';
import updateSite from './updateSite';
import getSite from './getSite';
import listSite from './listSite';
import deleteSite from './deleteSite';
import listReport from './listReport';

class siteController {
  public add = async (req: Request, res: Response) => {
    addSite(req, res);
  };

  public update = async (req: Request, res: Response) => {
    updateSite(req, res);
  };

  public view = async (req: Request, res: Response) => {
    getSite(req, res);
  };

  public list = async (req: Request, res: Response) => {
    listSite(req, res);
  };

  public reports = async (req: Request, res: Response) => {
    listReport(req, res);
  };

  public delete = async (req: Request, res: Response) => {
    deleteSite(req, res);
  };
}

export default siteController;
