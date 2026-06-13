import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  type: 'direct' | 'group';
  participants: mongoose.Types.ObjectId[];
  name?: string;
  description?: string;
  avatar?: string;
  admins?: mongoose.Types.ObjectId[];
  lastMessage?: {
    content: string;
    sender: mongoose.Types.ObjectId;
    timestamp: Date;
  };
  unreadCounts: Map<string, number>;
  isArchived: boolean;
}

const ConversationSchema = new Schema<IConversation>({
  type: { type: String, enum: ['direct', 'group'], required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  name: { type: String },
  description: { type: String },
  avatar: { type: String },
  admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: {
    content: { type: String },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
  },
  unreadCounts: { type: Map, of: Number, default: new Map() },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
