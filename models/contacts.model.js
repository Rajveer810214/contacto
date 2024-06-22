const mongoose = require('mongoose');

const EncryptedFieldSchema = new mongoose.Schema({
  iv: { type: String, required: true },
  data: { type: String, required: true }
});

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: EncryptedFieldSchema, required: true },
  linkedin: { type: EncryptedFieldSchema, required: true },
  twitter: { type: EncryptedFieldSchema, required: true }
});
module.exports = mongoose.model('Contact', ContactSchema);
