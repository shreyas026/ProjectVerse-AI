import mongoose, { Schema, Document } from 'mongoose';

export interface IJobPosting extends Document {
  companyId: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: string;
  skillsRequired: Array<{ skill: string; level: string }>;
  experience: { min: number; max: number };
  qualifications: string[];
  responsibilities: string[];
  location: { type: string; city: string; country: string };
  salary?: { min: number; max: number; currency: string; period: string };
  applicationDeadline: Date;
  maxApplicants: number;
  currentApplicants: number;
  status: string;
  embedding?: number[];
}

const JobPostingSchema = new Schema<IJobPosting>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['internship', 'full_time', 'part_time', 'contract', 'freelance'] },
  skillsRequired: [{ skill: String, level: String }],
  experience: { min: Number, max: Number },
  qualifications: [{ type: String }],
  responsibilities: [{ type: String }],
  location: { type: { type: String, enum: ['remote', 'on_site', 'hybrid'] }, city: String, country: String },
  salary: { min: Number, max: Number, currency: String, period: String },
  applicationDeadline: { type: Date },
  maxApplicants: { type: Number, default: 100 },
  currentApplicants: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'active', 'paused', 'closed', 'filled'], default: 'active' },
  embedding: [{ type: Number }],
}, { timestamps: true });

export const JobPosting = mongoose.model<IJobPosting>('JobPosting', JobPostingSchema);
