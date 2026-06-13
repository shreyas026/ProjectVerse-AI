import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: {
    type: string;
    text: string;
    mediaUrl?: string;
    fileName?: string;
    fileSize?: number;
    language?: string;
  };
  isEdited: boolean;
  editedAt?: Date;
  reactions: Array<{ userId: mongoose.Types.ObjectId; emoji: string }>;
  readBy: Array<{ userId: mongoose.Types.ObjectId; readAt: Date }>;
}

const MessageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: {
    type: { type: String, enum: ['text', 'image', 'file', 'code'], default: 'text' },
    text: { type: String, required: true },
    mediaUrl: { type: String },
    fileName: { type: String },
    fileSize: { type: Number },
    language: { type: String },
  },
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  reactions: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    emoji: { type: String },
  }],
  readBy: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

MessageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
