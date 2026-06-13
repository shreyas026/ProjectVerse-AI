import mongoose, { Schema, Document } from 'mongoose';

export interface ICodingChallenge extends Document {
  title: string;
  description: string;
  difficulty: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: Array<{ input: string; output: string; explanation: string }>;
  testCases: Array<{ input: string; expectedOutput: string; isHidden: boolean; weight: number }>;
  tags: string[];
  category: string;
  points: number;
  timeLimit: number;
  memoryLimit: number;
  totalSubmissions: number;
  totalAccepted: number;
  acceptanceRate: number;
  solution?: string;
  hints: string[];
  embedding?: number[];
  createdBy?: mongoose.Types.ObjectId;
}

const CodingChallengeSchema = new Schema<ICodingChallenge>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'expert'] },
  problemStatement: { type: String, required: true },
  inputFormat: { type: String },
  outputFormat: { type: String },
  constraints: { type: String },
  examples: [{ input: String, output: String, explanation: String }],
  testCases: [{ input: String, expectedOutput: String, isHidden: { type: Boolean, default: true }, weight: { type: Number, default: 1 } }],
  tags: [{ type: String }],
  category: { type: String },
  points: { type: Number, default: 10 },
  timeLimit: { type: Number, default: 1000 },
  memoryLimit: { type: Number, default: 256 },
  totalSubmissions: { type: Number, default: 0 },
  totalAccepted: { type: Number, default: 0 },
  acceptanceRate: { type: Number, default: 0 },
  solution: { type: String },
  hints: [{ type: String }],
  embedding: [{ type: Number }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const CodingChallenge = mongoose.model<ICodingChallenge>('CodingChallenge', CodingChallengeSchema);
