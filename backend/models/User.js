import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    rating: { type: Number, default: 1500 },
    maxRating: { type: Number, default: 1500 },
    rank: { type: String, default: 'Pupil' },
    streak: { type: Number, default: 1 },
    solvedCount: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    joinedDate: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
    contestHistory: [
      {
        contestId: String,
        contestTitle: String,
        rank: Number,
        ratingChange: Number,
        newRating: Number,
        date: String
      }
    ]
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
