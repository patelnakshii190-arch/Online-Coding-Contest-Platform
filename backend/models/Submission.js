import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    submissionId: { type: String, required: true, unique: true },
    problemId: { type: String, required: true },
    problemTitle: { type: String },
    userId: { type: String, required: true },
    userName: { type: String },
    code: { type: String, required: true },
    language: { type: String, required: true },
    verdict: { type: String, required: true },
    runtimeMs: { type: Number, default: 0 },
    memoryMB: { type: Number, default: 0 },
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
