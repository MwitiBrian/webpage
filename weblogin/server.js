const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory user storage (replace with a database in production)
let users = [];

// Secret key for JWT
const SECRET_KEY = 'your_secret_key'; // Change this to a strong secret in production

// Signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store user
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User created' });
});

// Password reset route
app.post('/reset-password', async (req, res) => {
  const { username, newPassword } = req.body;

  // Find the user
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Hash new password
  user.password = await bcrypt.hash(newPassword, 10);
  res.json({ message: 'Password reset successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});

