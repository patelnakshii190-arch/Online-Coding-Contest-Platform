import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    problemId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    category: { type: String, required: true },
    tags: [{ type: String }],
    acceptanceRate: { type: Number, default: 50.0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    solvedStatus: { type: String, default: 'unsolved' },
    description: { type: String, required: true },
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: [{ type: String }],
    sampleTestCases: [
      {
        id: String,
        input: String,
        expectedOutput: String,
        isHidden: Boolean
      }
    ],
    hiddenTestCases: [
      {
        id: String,
        input: String,
        expectedOutput: String,
        isHidden: Boolean
      }
    ],
    solutionExplanation: { type: String, default: '' },
    timeLimitSec: { type: Number, default: 1.0 },
    memoryLimitMB: { type: Number, default: 256 },
    starterTemplates: {
      cpp: String,
      java: String,
      python: String,
      javascript: String
    }
  },
  { timestamps: true }
);

export const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);
