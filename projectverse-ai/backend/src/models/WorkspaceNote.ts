import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkspaceNote extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdBy: mongoose.Types.ObjectId;
}

const WorkspaceNoteSchema = new Schema<IWorkspaceNote>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const WorkspaceNote = mongoose.model<IWorkspaceNote>('WorkspaceNote', WorkspaceNoteSchema);
