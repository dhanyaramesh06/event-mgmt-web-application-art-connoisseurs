//Nodejs encryption with CTR
//Helps in preventing social engineering attacks by hashing the password
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

//function which returns encrypted the password
function encryptPwd(pwd){
  const key = crypto.randomBytes(32);
  const initVector = crypto.randomBytes(16);
  console.log("Inside encrypt password");
  console.log(key);
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), initVector);
  let encrypted = cipher.update(pwd);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { initVector: initVector.toString('hex'), encryptedData: encrypted.toString('hex'),key:key };
}

//function which returns decrypted password
function decryptPwd(pwd) {
  console.log("Inside decrypt password");
  console.log(pwd);
  let initVector = Buffer.from(pwd.initVector, 'hex');
  let encryptedpwd = Buffer.from(pwd.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(pwd.key.buffer), initVector);
  let decrypted = decipher.update(encryptedpwd);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = {encryptPwd, decryptPwd};
