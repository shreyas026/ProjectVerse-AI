import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  userId: mongoose.Types.ObjectId;
  companyDetails: {
    name: string;
    logo?: string;
    banner?: string;
    description: string;
    mission?: string;
    culture?: string;
    founded?: number;
    employees?: string;
    website?: string;
    industry: string;
    subIndustry?: string;
  };
  locations: Array<{ type: string; city: string; state: string; country: string; address: string }>;
  benefits: string[];
  hiringStatus: boolean;
  openPositions: number;
  preferredColleges: string[];
  verified: boolean;
}

const CompanySchema = new Schema<ICompany>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyDetails: {
    name: { type: String, required: true },
    logo: { type: String },
    banner: { type: String },
    description: { type: String, required: true },
    mission: { type: String },
    culture: { type: String },
    founded: { type: Number },
    employees: { type: String },
    website: { type: String },
    industry: { type: String, required: true },
    subIndustry: { type: String },
  },
  locations: [{ type: { type: String }, city: String, state: String, country: String, address: String }],
  benefits: [{ type: String }],
  hiringStatus: { type: Boolean, default: true },
  openPositions: { type: Number, default: 0 },
  preferredColleges: [{ type: String }],
  verified: { type: Boolean, default: false },
}, { timestamps: true });

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
