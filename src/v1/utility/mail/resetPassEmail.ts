import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import sendEmail from '.';
import { PORTAL_URL, RESET_PASS_EXPIRE_TIME } from '../../../../config/config';

// Responsible for sending mail
const resetPassEmail = async (emailTo: string, otp: string) => {
  const filePath = path.join(
    __dirname,
    '../../../public/emailTemplate/forgot-password.html'
  );
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    PORTAL_URL,
    OTP: otp,
    EXPIRE_TIME: RESET_PASS_EXPIRE_TIME,
  };
  const htmlToSend = template(replacements);
  return sendEmail(emailTo, 'UltraAnalytics || Forgot password?', htmlToSend);
};

export default resetPassEmail;
