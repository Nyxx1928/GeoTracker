const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'your-secret-key-12345'; // Change this in production

// Import user seeder
const seedUsers = require('./seeders/userSeeder');

// In-memory user store (for demo – you can replace with database later)
const users = seedUsers();

// Login endpoint (exactly as required)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Login API server running on http://localhost:${PORT}`);
});