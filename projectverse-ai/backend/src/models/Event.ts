import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  organizerType: string;
  type: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  mode: string;
  venue?: string;
  location?: { address: string; city: string; coordinates: number[] };
  banner?: string;
  gallery: string[];
  maxParticipants: number;
  currentParticipants: number;
  prizes: Array<{ position: string; reward: string; amount: number }>;
  agenda: Array<{ time: string; title: string; description: string; speaker: string }>;
  tags: string[];
  technologies: string[];
  skillLevel: string;
  status: string;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true, index: 'text' },
  description: { type: String, required: true },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organizerType: { type: String, enum: ['student', 'faculty', 'company', 'college'] },
  type: { type: String, enum: ['hackathon', 'workshop', 'conference', 'coding_contest', 'webinar', 'seminar', 'cultural'] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationDeadline: { type: Date },
  mode: { type: String, enum: ['online', 'offline', 'hybrid'] },
  venue: { type: String },
  location: {
    address: { type: String },
    city: { type: String },
    coordinates: [{ type: Number }],
  },
  banner: { type: String },
  gallery: [{ type: String }],
  maxParticipants: { type: Number, default: 100 },
  currentParticipants: { type: Number, default: 0 },
  prizes: [{
    position: { type: String },
    reward: { type: String },
    amount: { type: Number },
  }],
  agenda: [{
    time: { type: String },
    title: { type: String },
    description: { type: String },
    speaker: { type: String },
  }],
  tags: [{ type: String }],
  technologies: [{ type: String }],
  skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all'] },
  status: { type: String, enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'], default: 'draft' },
}, { timestamps: true });

EventSchema.index({ startDate: 1 });
EventSchema.index({ tags: 1 });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
