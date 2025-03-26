import { FavoriteCity } from '@/app/api/favorites/route';

export async function getFavorites() {
  const response = await fetch('/api/favorites');
  
  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }
  
  return await response.json();
}

export async function checkFavoriteStatus(city: string, country: string) {
  const response = await fetch(`/api/favorites?city=${encodeURIComponent(city)}&country=${country}`);
  return await response.json();
}

export async function addFavorite(name: string, country: string) {
  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, country }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add to favorites');
  }
  
  return await response.json();
}

export async function updateFavorite(id: string, updates: Partial<FavoriteCity>) {
  const response = await fetch('/api/favorites', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update favorite');
  }
  
  return await response.json();
}

export async function deleteFavorite(id: string) {
  const response = await fetch(`/api/favorites?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete favorite');
  }
  
  return await response.json();
}