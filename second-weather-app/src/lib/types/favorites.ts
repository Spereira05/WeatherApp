export interface Favorite {
  _id: string;
  name: string;
  addedAt: string;
  lastChecked: string;
  notes?: string;
}

export interface FavoriteInput {
  name: string;
  notes?: string;
}