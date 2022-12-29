import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import sendEmail from '.';
import { PORTAL_URL } from '../../../config/config';

// Responsible for sending mail
const welcomeEmailToClient = async (emailTo: string, clientName: string) => {
  const filePath = path.join(
    __dirname,
    '../../../public/emailTemplate/welcome-email.html'
  );
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  // const PATH = path.join(__dirname + `../../../../public/images`);
  const PATH = `https://d2qcfls7p39rv.cloudfront.net`;

  const replacements = {
    PATH,
    clientName,
    PORTAL_URL,
  };
  const htmlToSend = template(replacements);
  return await sendEmail(emailTo, 'Welcome to UltraAnalytics', htmlToSend);
};

export default welcomeEmailToClient;
