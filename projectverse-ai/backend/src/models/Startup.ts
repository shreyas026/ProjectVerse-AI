import mongoose, { Schema, Document } from 'mongoose';

export interface IStartup extends Document {
  founderId: mongoose.Types.ObjectId;
  name: string;
  tagline: string;
  description: string;
  problem?: string;
  solution?: string;
  industry: string;
  stage: string;
  logo?: string;
  teamMembers: Array<{ userId: mongoose.Types.ObjectId; role: string }>;
  lookingFor: {
    coFounders: boolean;
    developers: boolean;
    designers: boolean;
    marketers: boolean;
    investors: boolean;
  };
  status: string;
}

const StartupSchema = new Schema<IStartup>({
  founderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  tagline: { type: String },
  description: { type: String, required: true },
  problem: { type: String },
  solution: { type: String },
  industry: { type: String },
  stage: { type: String, enum: ['idea', 'mvp', 'early_traction', 'growth', 'scaling'] },
  logo: { type: String },
  teamMembers: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, role: String }],
  lookingFor: {
    coFounders: { type: Boolean, default: false },
    developers: { type: Boolean, default: false },
    designers: { type: Boolean, default: false },
    marketers: { type: Boolean, default: false },
    investors: { type: Boolean, default: false },
  },
  status: { type: String, enum: ['active', 'inactive', 'acquired', 'closed'], default: 'active' },
}, { timestamps: true });

export const Startup = mongoose.model<IStartup>('Startup', StartupSchema);
