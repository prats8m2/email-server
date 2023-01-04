import { EMAIL_CONFIG, PR_EMAIL } from '../../../config/config';
import nodemailer from 'nodemailer';

// Responsible for sending mail
const sendEmail = async (emailTo: string, subject: string, content: string) => {
  const connection = createEmailConnection();
  await connection
    .sendMail({
      from: PR_EMAIL,
      to: PR_EMAIL,
      subject: subject,
      html: content,
    })
    .then(res => {
      console.log('~ res', res);
      return true;
    })
    .catch(err => {
      console.error(err);
      return false;
    });
};

// Responsible for mail connection
const createEmailConnection = () => {
  return nodemailer.createTransport({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure,
    auth: {
      user: EMAIL_CONFIG.user,
      pass: EMAIL_CONFIG.pass,
    },
    debug: true,
  });
};

export default sendEmail;
