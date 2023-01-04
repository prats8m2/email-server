import sendEmail from '.';

// Responsible for sending mail
const contactUsMail = async (
  name: string,
  email: string,
  mobile: string,
  message: string,
  org: string
) => {
  const data = `Name: ${name} <br> Organization: ${org} <br/> Email: ${email} <br/> Mobile: ${mobile} <br/> Message: ${message} `;
  return sendEmail(email, 'PR Shoot Contact us', data);
};

export default contactUsMail;
