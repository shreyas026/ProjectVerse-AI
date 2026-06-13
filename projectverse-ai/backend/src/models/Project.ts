import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  shortDescription: string;
  owner: mongoose.Types.ObjectId;
  team: Array<{
    userId: mongoose.Types.ObjectId;
    role: string;
    contribution?: string;
  }>;
  thumbnail?: string;
  screenshots: string[];
  demoVideo?: string;
  githubUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  category: string;
  technologies: string[];
  tags: string[];
  status: string;
  isPublic: boolean;
  originalityScore?: number;
  embedding?: number[];
  views: number;
  likes: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
  comments: Array<{
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }>;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 200 },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, default: 'developer' },
      contribution: { type: String },
    }],
    thumbnail: { type: String },
    screenshots: [{ type: String }],
    demoVideo: { type: String },
    githubUrl: { type: String },
    liveUrl: { type: String },
    documentationUrl: { type: String },
    category: { type: String, index: true },
    technologies: [{ type: String, index: true }],
    tags: [{ type: String, index: true }],
    status: { type: String, enum: ['idea', 'planning', 'in_progress', 'completed', 'deployed'], default: 'idea' },
    isPublic: { type: Boolean, default: true },
    originalityScore: { type: Number, min: 0, max: 100 },
    embedding: [{ type: Number }],
    views: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

ProjectSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ embedding: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
