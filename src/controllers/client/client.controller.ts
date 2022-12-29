import { Request, Response } from 'express';
import addClient from './addClient';
import updateClient from './updateClient';
import viewClient from './viewClient';
import listClient from './listClient';
import deleteClient from './deleteClient';
import configMedra from './configMedra';
import updateAirflow from './updateAirflow';
import listEnterprise from './listEnterprise';
import getMedraSettings from './getMedraSettings';
import updateMedraSettings from './updateMedraSettings';
import configSnowflake from './configSnowflake';
import updateWHOSettings from './updateWHOSettings';
import getWHOSettings from './getWHOSettings';
import getAirflowLogin from './getAirflowLogin';
import addClientWithoutLogi from './addClientWithoutLogi';

class clientController {
  public add = async (req: Request, res: Response) => {
    addClient(req, res);
  };

  public addClient = async (req: Request, res: Response) => {
    addClientWithoutLogi(req, res);
  };
  public update = async (req: Request, res: Response) => {
    updateClient(req, res);
  };

  public view = async (req: Request, res: Response) => {
    viewClient(req, res);
  };

  public list = async (req: Request, res: Response) => {
    listClient(req, res);
  };

  public delete = async (req: Request, res: Response) => {
    deleteClient(req, res);
  };

  public configMedra = async (req: Request, res: Response) => {
    configMedra(req, res);
  };

  public configSnowflake = async (req: Request, res: Response) => {
    configSnowflake(req, res);
  };

  public updateAirflow = async (req: Request, res: Response) => {
    updateAirflow(req, res);
  };

  public listEnterprise = async (req: Request, res: Response) => {
    listEnterprise(req, res);
  };

  public updateMedraSettings = async (req: Request, res: Response) => {
    updateMedraSettings(req, res);
  };

  public getMedraSettings = async (req: Request, res: Response) => {
    getMedraSettings(req, res);
  };

  public updateWHOSettings = async (req: Request, res: Response) => {
    updateWHOSettings(req, res);
  };

  public getWHOSettings = async (req: Request, res: Response) => {
    getWHOSettings(req, res);
  };

  public getAirflowLogin = async (req: Request, res: Response) => {
    getAirflowLogin(req, res);
  };
}

export default clientController;
