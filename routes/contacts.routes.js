const express = require('express');
const router = express.Router();
const Contact = require('../models/contacts.model');
const { encrypt, decrypt } = require('../utils/crypto');
const verifyToken = require('./verifyToken.routes');

// Create Contact
router.post('/create', verifyToken, async (req, res) => {
  const { name, phone, email, linkedin, twitter } = req.body;

  try {
    if (!name || !phone || !email || !linkedin || !twitter) {
      return res.status(400).send('Name, phone, email, linkedin, and twitter are required');
    }
    const contacts = await Contact.find({ name: { $regex: name, $options: 'i' } });
    if (contacts.length !== 0) return res.status(404).send('Contact is already created with this name');


    // Encrypt sensitive data before saving to the database
    const encryptedEmail = encrypt(email);
    const encryptedLinkedin = encrypt(linkedin);
    const encryptedTwitter = encrypt(twitter);

    const contact = new Contact({
      name: name,
      phone: phone,
      email: encryptedEmail,
      linkedin: encryptedLinkedin,
      twitter: encryptedTwitter
    });

    await contact.save();
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Edit Contact
router.put('/edit', verifyToken, async (req, res) => {
  const { name, email, linkedin, twitter } = req.body;
    if(!email && !linkedin && !twitter) {
        return res.status(400).send('email, linkedin, and twitter are required');

    }
  try {
    const contact = await Contact.findOne({ name });
    if (!contact) return res.status(404).send('Contact not found');

    if (email) {
      const encryptedEmail = encrypt(email);
      contact.email.iv = encryptedEmail.iv;
      contact.email.data = encryptedEmail.data;
    }
    if (linkedin) {
      const encryptedLinkedin = encrypt(linkedin);
      contact.linkedin.iv = encryptedLinkedin.iv;
      contact.linkedin.data = encryptedLinkedin.data;
    }
    if (twitter) {
      const encryptedTwitter = encrypt(twitter);
      contact.twitter.iv = encryptedTwitter.iv;
      contact.twitter.data = encryptedTwitter.data;
    }

    await contact.save();
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Search Contact
router.post('/search', verifyToken, async (req, res) => {
  const { search_token } = req.body;

  try {
    // Use the search token directly in the query to find contacts
    const contacts = await Contact.find({ name: { $regex: search_token, $options: 'i' } });
    if (contacts.length === 0) return res.status(404).send('No contacts found');

    const decryptedContacts = contacts.map(contact => ({
      _id: contact._id,
      name: contact.name,
      phone: contact.phone,
      email: decrypt(contact.email.iv, contact.email.data),
      linkedin: decrypt(contact.linkedin.iv, contact.linkedin.data),
      twitter: decrypt(contact.twitter.iv, contact.twitter.data),
      __v: contact.__v
    }));

    res.json(decryptedContacts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
