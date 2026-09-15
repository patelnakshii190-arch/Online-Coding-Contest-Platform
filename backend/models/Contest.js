import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema(
  {
    contestId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['LIVE', 'UPCOMING', 'ENDED'], default: 'UPCOMING' },
    durationMinutes: { type: Number, default: 90 },
    registeredCount: { type: Number, default: 0 },
    registeredUsers: [{ type: String }],
    rules: [{ type: String }],
    problems: [
      {
        id: String,
        problemId: String,
        letter: String,
        title: String,
        points: Number,
        difficulty: String
      }
    ]
  },
  { timestamps: true }
);

export const Contest = mongoose.models.Contest || mongoose.model('Contest', contestSchema);
