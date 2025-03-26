import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document { 
  userId: Schema.Types.ObjectId;
  expires: Date;
  sessionToken: string; 
}

const sessionSchema = new Schema<ISession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expires: {
    type: Date,
    required: true
  },
  sessionToken: {
    type: String,
    unique: true,
    required: true
  },
});

export const Session = (mongoose.models.Session as mongoose.Model<ISession>) || mongoose.model<ISession>('Session', sessionSchema);