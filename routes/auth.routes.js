const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const dummyUser = {
  username: 'saltman',
  password: bcrypt.hashSync('oai1122', 10)
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== dummyUser.username || !bcrypt.compareSync(password, dummyUser.password)) {
    return res.status(400).send('Invalid Credentials');
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
