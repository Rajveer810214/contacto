const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Ensure the key is loaded from the environment

// Encrypting text
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Generate a random IV
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), data: encrypted }; // Return IV and encrypted data
}

// Decrypting text
function decrypt(iv, encryptedText) {
  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
