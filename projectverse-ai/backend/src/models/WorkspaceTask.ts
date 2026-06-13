import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkspaceTask extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  dueDate?: Date;
  tags: string[];
}

const WorkspaceTaskSchema = new Schema<IWorkspaceTask>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in_progress', 'review', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  assignee: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  tags: [{ type: String }],
}, { timestamps: true });

WorkspaceTaskSchema.index({ projectId: 1, status: 1 });

export const WorkspaceTask = mongoose.model<IWorkspaceTask>('WorkspaceTask', WorkspaceTaskSchema);
