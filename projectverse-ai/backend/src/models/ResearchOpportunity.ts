import mongoose, { Schema, Document } from 'mongoose';

export interface IResearchOpportunity extends Document {
  facultyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  domain: string;
  subDomain: string[];
  skillsRequired: string[];
  prerequisites: string[];
  yearPreference: number[];
  departmentPreference: string[];
  positionsAvailable: number;
  duration: string;
  stipend?: { amount: number; currency: string; period: string };
  status: string;
  applications: Array<{
    studentId: mongoose.Types.ObjectId;
    statement: string;
    resume: string;
    status: string;
    appliedAt: Date;
  }>;
}

const ResearchOpportunitySchema = new Schema<IResearchOpportunity>({
  facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  domain: { type: String, required: true },
  subDomain: [{ type: String }],
  skillsRequired: [{ type: String }],
  prerequisites: [{ type: String }],
  yearPreference: [{ type: Number }],
  departmentPreference: [{ type: String }],
  positionsAvailable: { type: Number, default: 1 },
  duration: { type: String },
  stipend: { amount: Number, currency: String, period: String },
  status: { type: String, enum: ['open', 'in_progress', 'closed', 'completed'], default: 'open' },
  applications: [{
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
    statement: { type: String },
    resume: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export const ResearchOpportunity = mongoose.model<IResearchOpportunity>('ResearchOpportunity', ResearchOpportunitySchema);
