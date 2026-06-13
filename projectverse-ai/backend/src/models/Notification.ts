import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: mongoose.Types.ObjectId;
  link?: string;
  image?: string;
  isRead: boolean;
  readAt?: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['team_invite', 'team_accepted', 'project_like', 'event_reminder', 'event_registration', 'message', 'call_missed', 'badge_earned', 'achievement', 'job_application', 'interview_call', 'ai_mentor', 'system'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  entityType: { type: String },
  entityId: { type: Schema.Types.ObjectId },
  link: { type: String },
  image: { type: String },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
}, { timestamps: true });

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
