import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../../utility/response';
import { getCustomRepository } from 'typeorm';
import { ClientRepository } from '../../../repository/client';
import { VALIDATION, MAX_LENGTH, CODE } from '../../../../../config/config';
import { ClientI } from '../../../interface/client/client';
import ReportService from '../../../services/reports/report';
import { SiteRepository } from '../../../repository/site';
import { SiteI } from '../../../interface/site/site';
import DECRYPT from '../../../utility/decrypt';

const addClientValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //fetch data from body
  const {
    name,
    clientID,
    email,
    mobile,
    address,
    zipcode,
    country,
    contactName,
    contactEmail,
    status,
    sites,
  } = req.body;

  //check for data VALIDATION for mandatory data
  validateMandatoryData(res, name, clientID, email, status);

  //check for optional data
  validateOptionalData(
    res,
    mobile,
    address,
    zipcode,
    country,
    contactName,
    contactEmail
  );

  //check for existing client data
  const clientRepo = getCustomRepository(ClientRepository);
  const client: ClientI = await clientRepo.getClient([{ name }, { email }]);
  if (client) {
    if (client.name === name) {
      sendResponse(
        res,
        false,
        CODE.INVALID_KEY,
        'Client name already exist',
        name
      );
    }
    // if (client.clientID === clientID) {
    //   sendResponse(
    //     res,
    //     false,
    //     CODE.INVALID_KEY,
    //     "Client clientID already exist",
    //     clientID
    //   );
    // }
    if (client.email === email) {
      sendResponse(
        res,
        false,
        CODE.INVALID_KEY,
        'Client email already exist',
        email
      );
    } else {
      sendResponse(
        res,
        false,
        CODE.ALREADY_EXIST,
        'Client already exist error',
        client
      );
    }
    return;
  }

  //check for organization on reports
  const siteRepo = getCustomRepository(SiteRepository);
  const siteData: SiteI = await siteRepo.getSiteDetails({ id: sites[0].id });
  const reportService = new ReportService(
    siteData.ip,
    siteData.port,
    `${siteData.username}:${DECRYPT(siteData.password)}`,
    name
  );
  const usersOnReports = await reportService.getUser();
  for (let index = 0; index < usersOnReports.length; index++) {
    const user = usersOnReports[index];
    if (user.fullName === 'Organization Administrator') {
      if (user.organization === name) {
        next();
        return;
      }
    }
  }
  sendResponse(
    res,
    false,
    CODE.DENIED,
    'Please create organization on Reporting server first',
    name
  );
};

const validateOptionalData = (
  res: Response,
  mobile: string,
  address: string,
  zipcode: string,
  country: string,
  contactName: string,
  contactEmail: string
) => {
  if (
    contactEmail &&
    contactEmail.length > MAX_LENGTH.EMAIL &&
    !new RegExp(VALIDATION.email).test(contactEmail)
  ) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client contact email');
    return false;
  }

  if (address && address.length > MAX_LENGTH.ADDRESS) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client address');
    return false;
  }

  if (zipcode && zipcode.length > MAX_LENGTH.ZIP_CODE) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client zipcode');
    return false;
  }

  if (country && country.length > MAX_LENGTH.COUNTRY) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client country');
    return false;
  }

  if (contactName && contactName.length > MAX_LENGTH.CONTACT_NAME) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client contact name');
    return false;
  }

  // if (mobile && !new RegExp(VALIDATION.mobile).test(mobile)) {
  //   sendResponse(res, false, CODE.INVALID_KEY, "Invalid client mobile");
  //   return false;
  // }

  // if (contactMobile && !new RegExp(VALIDATION.mobile).test(contactMobile)) {
  //   sendResponse(res, false, CODE.INVALID_KEY, "Invalid client contact mobile");
  //   return false;
  // }

  if (
    contactEmail &&
    contactEmail.length > 300 &&
    !new RegExp(VALIDATION.email).test(contactEmail)
  ) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client contact email');
    return false;
  }
};
const validateMandatoryData = (
  res: Response,
  name: string,
  clientID: string,
  email: string,
  status: number
) => {
  if (!name || name.length > MAX_LENGTH.CLIENT_NAME) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client name', name);
    return;
  }

  if (!clientID || clientID.length > MAX_LENGTH.CLIENT_ID) {
    sendResponse(
      res,
      false,
      CODE.INVALID_KEY,
      'Invalid client clientID',
      clientID
    );
    return;
  }

  if (
    !email ||
    !new RegExp(VALIDATION.email).test(email) ||
    email.length > MAX_LENGTH.EMAIL
  ) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client email', email);
    return;
  }

  if (typeof status !== 'number' || (status !== 0 && status !== 1)) {
    sendResponse(res, false, CODE.INVALID_KEY, 'Invalid client status', status);
    return;
  }
};

export default addClientValidation;
