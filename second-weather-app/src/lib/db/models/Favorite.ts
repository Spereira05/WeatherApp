import mongoose, { Document, Schema } from 'mongoose';

interface IFavorite extends Document{
  name: string;
  country: string;
  addedAt: Date;
  notes?: string;
  lastChecked?: Date;
  userId: string;
}

const favoriteSchema = new Schema<IFavorite>({
  name: {
    type: String,
    required: [true, 'Please provide a city name'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Please provide a country code'],
    trim: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
  lastChecked: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
});

favoriteSchema.index({ name: 1, country: 1, userId: 1 }, { unique: true });
export const Favorite = (mongoose.models.Favorite as mongoose.Model<IFavorite>) || mongoose.model<IFavorite>('Favorite', favoriteSchema);