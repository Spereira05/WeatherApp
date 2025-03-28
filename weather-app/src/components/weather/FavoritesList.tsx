'use client';

import { useState, useEffect } from 'react';
import { FavoriteCity } from '@/lib/types/favorites';

interface FavoritesListProps {
  onCityClick?: (city: string, country: string) => void;
}

export default function FavoritesList({ onCityClick }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/favorites');
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFavorites();
  }, []);

  const updateFavorite = async (id: string, updates: Partial<FavoriteCity>) => {
    try {
      console.log("Updating favorite with ID:", id, "Updates:", updates);
      
      const favoriteId = favorites.find(f => f.id === id)?._id || id;
      
      const response = await fetch('/api/favorites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: favoriteId, ...updates }),
      });

      if (!response.ok) throw new Error('Failed to update favorite');
      setFavorites(prev => 
        prev.map(fav => fav.id === id ? {...fav, ...updates} : fav)
      );
      setEditingId(null);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update favorite');
    }
  };

  const deleteFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/favorites?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete favorite');
      setFavorites(prev => prev.filter(fav => fav.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete favorite');
    }
  };
  
  if (isLoading)   
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)   
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  if (favorites.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No favorite cities yet. Add some by searching for a city!
      </div>
    )
  }

  return (
    <div className="space-y-4 p-2 md:p-0">
      <h2 className="text-xl md:text-2xl font-bold">Favorite Cities</h2>
      
      <div className="grid gap-4">
        {favorites.map(favorite => {
          // Create a unique identifier for this favorite
          const favoriteUniqueId = favorite._id || favorite.id;
          
          // Check if this specific favorite is being edited
          const isEditing = editingId === favoriteUniqueId;
          
          return (
            <div
              key={favoriteUniqueId}
              className="p-3 md:p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div 
                className={`${onCityClick ? 'cursor-pointer hover:bg-blue-50' : ''} p-2 mb-2 rounded`}
                onClick={() => onCityClick && onCityClick(favorite.name, favorite.country || '')}
              >
                <h3 className="font-semibold text-gray-800">{favorite.name}</h3>
                {!isEditing && (
                  <p className="text-sm text-gray-600">{favorite.notes}</p>
                )}
              </div>
              
              {isEditing ? (
                // Editing mode for this specific favorite
                <div className="w-full">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="border rounded px-2 py-1 mt-1 w-full"
                    placeholder="Add a note..."
                  />
                  <div className="flex gap-2 mt-2 justify-end">
                    <button
                      onClick={() => updateFavorite(favoriteUniqueId, { notes: noteInput })}
                      className="text-green-600 hover:text-green-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="flex gap-2 w-full justify-end">
                  <button
                    onClick={() => {
                      setEditingId(favoriteUniqueId);
                      setNoteInput(favorite.notes || '');
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}