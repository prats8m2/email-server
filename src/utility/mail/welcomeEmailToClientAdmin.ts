import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import sendEmail from '.';
import { PORTAL_URL } from '../../../config/config';

// Responsible for sending mail
const welcomeEmailToClientAdmin = async (
  emailTo: string,
  clientAdminName: string,
  username: string,
  password: string
) => {
  try {
    const filePath = path.join(
      __dirname,
      '../../../public/emailTemplate/welcome-email-clientAdmin.html'
    );
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    // const PATH = path.join(__dirname + `../../../../public/images`);
    const PATH = `https://d2qcfls7p39rv.cloudfront.net`;

    const replacements = {
      PATH,
      clientAdminName,
      PORTAL_URL,
      username,
      password,
    };
    const htmlToSend = template(replacements);
    // console.log("~ htmlToSend", htmlToSend);

    return await sendEmail(emailTo, 'Welcome to UltraAnalytics', htmlToSend);
  } catch (_e) {
    console.log('~ _e', _e);
  }
};

export default welcomeEmailToClientAdmin;
