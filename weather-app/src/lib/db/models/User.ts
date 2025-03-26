import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  accounts?: Schema.Types.ObjectId[];
  sessions?: Schema.Types.ObjectId[];
  favorites?: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },
    emailVerified: Date,
    image: String,
    accounts: [{
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }],
    sessions: [{
      type: Schema.Types.ObjectId,
      ref: 'Session'
    }],
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: 'Favorite'
    }],
  },
  { timestamps: true }
);

export const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', userSchema)


