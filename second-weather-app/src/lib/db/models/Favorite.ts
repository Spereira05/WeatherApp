import mongoose, { Schema } from 'mongoose';

interface IFavorite {
  name: string;
  country: string;
  addedAt: Date;
  notes?: string;
  lastChecked?: Date;
}

const favoriteSchema = new Schema<IFavorite>({
  name: {
    type: String,
    required: [true, 'Please provide a city name'],
    trim: true,
    unique: true
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
});

favoriteSchema.index({ name: 1, country: 1 }, { unique: true });
export const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', favoriteSchema);