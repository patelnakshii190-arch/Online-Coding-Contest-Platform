import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDb, writeDb } from '../db.js';
import { JWT_SECRET, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password required' });
  }

  const db = readDb();
  const existingUser = db.users.find((u) => u.email === email || u.username === username);

  if (existingUser) {
    return res.status(400).json({ message: 'User with this email or username already exists' });
  }

  const newUser = {
    id: 'u_' + Math.random().toString(36).substr(2, 6),
    name: name || username,
    username,
    email,
    password: bcrypt.hashSync(password, 10),
    role: 'user',
    rating: 1500,
    maxRating: 1500,
    rank: 'Pupil',
    solvedCount: { easy: 0, medium: 0, hard: 0, total: 0 },
    streak: 1,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    contestHistory: [],
  };

  db.users.push(newUser);
  writeDb(db);

  const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json({ token, user: userWithoutPass });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const db = readDb();
  const user = db.users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

  const { password: _, ...userWithoutPass } = user;
  res.json({ token, user: userWithoutPass });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { password: _, ...userWithoutPass } = user;
  res.json(userWithoutPass);
});

export default router;
