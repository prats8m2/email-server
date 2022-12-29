import CryptoJS from 'crypto-js';

const ENCRYPT = (decrypted: string) => {
  //get the master secret key
  const KEY = process.env.MASTER_SECRET_KEY;
  return CryptoJS.AES.encrypt(decrypted, KEY).toString();
};

export default ENCRYPT;
