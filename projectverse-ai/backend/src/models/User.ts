import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'company' | 'alumni' | 'admin';
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  college?: {
    name: string;
    department: string;
    yearOfStudy: number;
    rollNumber: string;
    graduationYear: number;
  };
  social?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
    website?: string;
  };
  scores: {
    codingRating: number;
    contributionScore: number;
    innovationScore: number;
    reliabilityScore: number;
    placementReadiness: number;
  };
  skills: Array<{ name: string; level: string; verified: boolean }>;
  interests: string[];
  achievements: Array<{ title: string; description: string; date: Date; icon: string }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialUrl?: string;
    image?: string;
  }>;
  status: string;
  isEmailVerified: boolean;
  googleId?: string;
  embedding?: number[];
  lastActive?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['student', 'faculty', 'company', 'alumni', 'admin'], default: 'student' },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    avatar: { type: String },
    phone: { type: String },
    college: {
      name: { type: String },
      department: { type: String },
      yearOfStudy: { type: Number, min: 1, max: 4 },
      rollNumber: { type: String },
      graduationYear: { type: Number },
    },
    social: {
      github: { type: String },
      linkedin: { type: String },
      portfolio: { type: String },
      twitter: { type: String },
      website: { type: String },
    },
    scores: {
      codingRating: { type: Number, default: 1000 },
      contributionScore: { type: Number, default: 0 },
      innovationScore: { type: Number, default: 0 },
      reliabilityScore: { type: Number, default: 0 },
      placementReadiness: { type: Number, default: 0 },
    },
    skills: [{
      name: { type: String },
      level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
      verified: { type: Boolean, default: false },
    }],
    interests: [{ type: String }],
    achievements: [{
      title: { type: String },
      description: { type: String },
      date: { type: Date },
      icon: { type: String },
    }],
    certifications: [{
      name: { type: String },
      issuer: { type: String },
      issueDate: { type: Date },
      expiryDate: { type: Date },
      credentialUrl: { type: String },
      image: { type: String },
    }],
    status: { type: String, enum: ['active', 'inactive', 'suspended', 'pending_verification'], default: 'pending_verification' },
    isEmailVerified: { type: Boolean, default: false },
    googleId: { type: String, sparse: true },
    embedding: [{ type: Number }],
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'college.department': 1, role: 1 });
UserSchema.index({ 'skills.name': 1 });
UserSchema.index({ embedding: 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
