import { Router } from 'express';
import updateClientValidation from '../middlewares/validations/client/updateClientValidation';
import ClientController from '../controllers/client/client.controller';
import AuthMiddleware from '../middlewares/authorization/auth.middleware';
import addClientValidation from '../middlewares/validations/client/addClientValidation';
import listClientValidation from '../middlewares/validations/client/listClientValidation';
import viewClientValidation from '../middlewares/validations/client/viewClientValidation';
import updateMedraValidation from '../middlewares/validations/client/updateMedraValidation';
import updateAirflowValidation from '../middlewares/validations/client/updateAirflowValidation';
import listEnterpriseValidation from '../middlewares/validations/client/listEnterpriseValidation';
import deleteClientValidation from '../middlewares/validations/client/deleteClientValidation';
import configSnowflakeValidation from '../middlewares/validations/client/configSnowflakeValidation';
import addClientWithoutLogi from '../middlewares/validations/client/addClientWithoutLogi';

const router = Router();
const clientController = new ClientController();

router.post('/add', AuthMiddleware, addClientValidation, clientController.add);
router.post(
  '/addClient',
  AuthMiddleware,
  addClientWithoutLogi,
  clientController.addClient
);

router.patch(
  '/update',
  AuthMiddleware,
  updateClientValidation,
  clientController.update
);

router.patch(
  '/config/medra',
  AuthMiddleware,
  updateMedraValidation,
  clientController.configMedra
);

router.patch(
  '/config/airflow',
  AuthMiddleware,
  updateAirflowValidation,
  clientController.updateAirflow
);

router.patch(
  '/config/snowflake',
  AuthMiddleware,
  configSnowflakeValidation,
  clientController.configSnowflake
);

router.get(
  '/list',
  AuthMiddleware,
  listClientValidation,
  clientController.list
);

router.get(
  '/view/:id',
  AuthMiddleware,
  viewClientValidation,
  clientController.view
);

router.delete(
  '/delete/:id',
  AuthMiddleware,
  deleteClientValidation,
  clientController.delete
);

router.get(
  '/enterprise/:clientId',
  AuthMiddleware,
  listEnterpriseValidation,
  clientController.listEnterprise
);

router.get(
  '/setting/medra/:clientId',
  AuthMiddleware,
  clientController.getMedraSettings
);

router.patch(
  '/setting/medra/:clientId',
  AuthMiddleware,
  clientController.updateMedraSettings
);

router.get(
  '/setting/WHO/:clientId',
  AuthMiddleware,
  clientController.getWHOSettings
);

router.patch(
  '/setting/WHO/:clientId',
  AuthMiddleware,
  clientController.updateWHOSettings
);

router.get(
  '/setting/airflow/:clientId',
  AuthMiddleware,
  clientController.getAirflowLogin
);

router.patch(
  '/updateClient',
  AuthMiddleware,
  updateClientValidation,
  clientController.update
);

export default router;
