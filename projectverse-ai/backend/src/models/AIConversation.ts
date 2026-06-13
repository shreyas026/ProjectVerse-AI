import mongoose, { Schema, Document } from 'mongoose';

export interface IAIConversation extends Document {
  userId: mongoose.Types.ObjectId;
  aiType: 'mentor' | 'cofounder' | 'chatbot';
  title: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    attachments?: Array<{ type: string; data: unknown }>;
    artifacts?: Array<{ type: string; data: unknown }>;
  }>;
  context: {
    topic?: string;
    skills?: string[];
    projectIdea?: string;
    careerGoal?: string;
  };
}

const AIConversationSchema = new Schema<IAIConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  aiType: { type: String, enum: ['mentor', 'cofounder', 'chatbot'], required: true },
  title: { type: String, default: 'New Conversation' },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    attachments: [{ type: { type: String }, data: Schema.Types.Mixed }],
    artifacts: [{ type: { type: String }, data: Schema.Types.Mixed }],
  }],
  context: {
    topic: { type: String },
    skills: [{ type: String }],
    projectIdea: { type: String },
    careerGoal: { type: String },
  },
}, { timestamps: true });

AIConversationSchema.index({ userId: 1, aiType: 1, updatedAt: -1 });

export const AIConversation = mongoose.model<IAIConversation>('AIConversation', AIConversationSchema);
