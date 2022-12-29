import { Request, Response } from 'express';
import dashboard from './dashboard';
import auditLogs from './auditLogs';
import exportLogs from './exportLogs';

class DashboardController {
  public dashboard = async (req: Request, res: Response) => {
    dashboard(req, res);
  };

  public auditLogs = async (req: Request, res: Response) => {
    auditLogs(req, res);
  };

  public exportLogs = async (req: Request, res: Response) => {
    exportLogs(req, res);
  };
}

export default DashboardController;
