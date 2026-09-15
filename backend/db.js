import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/User.js';
import { Problem } from './models/Problem.js';
import { Contest } from './models/Contest.js';
import { Submission } from './models/Submission.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

export let isMongoConnected = false;

export async function connectDb() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.log('💡 MONGODB_URI not specified in backend/.env.');
    console.log('⚙️ Backend running with high-performance JSON database engine.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log('🍃 MongoDB Atlas Connected successfully to QuantumArena database!');
    await seedDbIfEmpty();
  } catch (err) {
    isMongoConnected = false;
    console.log('⚠️ Could not connect to MongoDB Atlas URI. Running with JSON database engine:', err.message);
  }
}

export function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      users: [
        {
          id: 'user_1',
          name: 'Aditya Verma',
          username: 'aditya_coder',
          email: 'admin@quantumarena.in',
          password: bcrypt.hashSync('admin123', 10),
          role: 'admin',
          rating: 2850,
          maxRating: 2900,
          rank: 'Overlord',
          streak: 45,
          solvedCount: { easy: 45, medium: 32, hard: 8, total: 85 }
        },
        {
          id: 'user_2',
          name: 'Priya Sharma',
          username: 'priya_algo',
          email: 'priya@quantumarena.in',
          password: bcrypt.hashSync('password123', 10),
          role: 'user',
          rating: 3450,
          maxRating: 3450,
          rank: 'Grandmaster',
          streak: 28,
          solvedCount: { easy: 80, medium: 60, hard: 25, total: 165 }
        }
      ],
      problems: [],
      contests: [],
      submissions: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return { users: [], problems: [], contests: [], submissions: [] };
  }
}

export function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export async function seedDbIfEmpty() {
  if (!isMongoConnected) return;
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        {
          name: 'Priya Sharma',
          username: 'priya_algo',
          email: 'priya@quantumarena.in',
          password: bcrypt.hashSync('password123', 10),
          role: 'user',
          rating: 3450,
          maxRating: 3450,
          rank: 'Grandmaster',
          streak: 28
        },
        {
          name: 'Aditya Verma',
          username: 'aditya_coder',
          email: 'admin@quantumarena.in',
          password: bcrypt.hashSync('admin123', 10),
          role: 'admin',
          rating: 2850,
          maxRating: 2900,
          rank: 'Overlord',
          streak: 45
        }
      ]);
      console.log('✅ Seeded initial accounts into MongoDB Atlas.');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}
