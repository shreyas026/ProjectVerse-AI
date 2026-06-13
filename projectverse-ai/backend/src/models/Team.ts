import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description: string;
  avatar?: string;
  leader: mongoose.Types.ObjectId;
  members: Array<{
    userId: mongoose.Types.ObjectId;
    role: string;
    joinedAt: Date;
    contribution: number;
  }>;
  projectId?: mongoose.Types.ObjectId;
  requirements: {
    skillsNeeded: string[];
    rolesNeeded: string[];
    departmentPreference: string[];
    isOpen: boolean;
  };
  skillEmbedding?: number[];
  status: string;
}

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  description: { type: String },
  avatar: { type: String },
  leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    joinedAt: { type: Date, default: Date.now },
    contribution: { type: Number, default: 0 },
  }],
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  requirements: {
    skillsNeeded: [{ type: String }],
    rolesNeeded: [{ type: String }],
    departmentPreference: [{ type: String }],
    isOpen: { type: Boolean, default: true },
  },
  skillEmbedding: [{ type: Number }],
  status: { type: String, enum: ['forming', 'active', 'completed', 'disbanded'], default: 'forming' },
}, { timestamps: true });

export const Team = mongoose.model<ITeam>('Team', TeamSchema);
