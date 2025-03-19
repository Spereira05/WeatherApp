'use client';

import { useState, useEffect } from 'react';
import { FavoriteCity } from '../app/api/favorites/route';


export function FavoritesList() {
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
      const response = await fetch('/api/favorites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) throw new Error('Failed to update favorite');
      const updated = await response.json();
      setFavorites(prev => 
        prev.map(fav => fav.id === id ? updated : fav)
      );
      setEditingId(null);
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

  function checkFavorites = () => {
    
  }
  
  

  if (isLoading) return <div>Loading favorites...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Favorite Cities</h2>
      
      <div className="grid gap-4">
        {favorites.map(favorite => (
          <div
            key={favorite.id}
            className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{favorite.name}</h3>
              {editingId === favorite.id ? (
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="border rounded px-2 py-1 mt-1"
                  placeholder="Add a note..."
                />
              ) : (
                <p className="text-sm text-gray-600">{favorite.notes}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              {editingId === favorite.id ? (
                <>
                  <button
                    onClick={() => {
                      updateFavorite(favorite.id, { notes: noteInput });
                    }}
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
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(favorite.id);
                      setNoteInput(favorite.notes || '');
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFavorite(favorite.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}