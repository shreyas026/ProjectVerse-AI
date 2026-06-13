import mongoose, { Schema, Document } from 'mongoose';

export interface ICodingSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: string;
  testCaseResults: Array<{
    testCaseId: mongoose.Types.ObjectId;
    passed: boolean;
    actualOutput: string;
    executionTime: number;
    memoryUsed: number;
  }>;
  executionTime: number;
  memoryUsed: number;
  score: number;
  aiReview?: {
    codeQuality: number;
    suggestions: string[];
    optimizedSolution: string;
    complexity: { time: string; space: string };
  };
}

const CodingSubmissionSchema = new Schema<ICodingSubmission>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: Schema.Types.ObjectId, ref: 'CodingChallenge', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: { type: String, enum: ['pending', 'running', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compilation_error'], default: 'pending' },
  testCaseResults: [{
    testCaseId: { type: Schema.Types.ObjectId },
    passed: { type: Boolean },
    actualOutput: { type: String },
    executionTime: { type: Number },
    memoryUsed: { type: Number },
  }],
  executionTime: { type: Number },
  memoryUsed: { type: Number },
  score: { type: Number, default: 0 },
  aiReview: {
    codeQuality: { type: Number },
    suggestions: [{ type: String }],
    optimizedSolution: { type: String },
    complexity: {
      time: { type: String },
      space: { type: String },
    },
  },
}, { timestamps: true });

CodingSubmissionSchema.index({ userId: 1, challengeId: 1 });

export const CodingSubmission = mongoose.model<ICodingSubmission>('CodingSubmission', CodingSubmissionSchema);
