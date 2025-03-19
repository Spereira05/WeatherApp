import { WeatherData } from "@/lib/types/weather";
import { useState, useEffect } from "react"

interface DisplayWeatherProps {
  data: WeatherData
}
  
export default function DisplayWeather({ data }: DisplayWeatherProps) {
  
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
    
  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites?city=${encodeURIComponent(data.name)}&country=${data.sys.country}`);
      const result = await response.json();
      setIsFavorite(result.isFavorite);
      setFavoriteId(result.favoriteId);
      return result;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return { isFavorite: false, favoriteId: null };
    }
  };
  
  useEffect(() => {
    if (data?.name) {
      checkFavoriteStatus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.name, data?.sys?.country]);
  
  const toggleFavorite = async () => {
    try {
      if (isFavorite && favoriteId) {
        const response = await fetch(`/api/favorites?id=${favoriteId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to remove from favorites');
        }
        
        setIsFavorite(false);
        setFavoriteId(null);
        setMessage({ text: `${data.name} removed from favorites!`, type: 'success' });
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: data.name, country: data.sys.country }),
        });
      
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to add to favorites');
        }
        
        const result = await response.json();
        setFavoriteId(result._id);
        setIsFavorite(true);
        setMessage({
          text: `${data.name} added to favorites`,
          type: 'success'
        });
      }
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : 'Failed to update favorites',
        type: 'error'
      });
    } finally {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {message && (<div className={`mb-4 p-3 rounded ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{data.name}</h2>
          <p className="text-sm text-gray-600">{data.sys.country}</p>
        </div>        
        <button
          onClick={toggleFavorite}
          className={`px-4 py-2 ${
            isFavorite 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-400 hover:bg-blue-600'
          } text-white rounded-lg transition-colors`}
        > 
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
        
      <div className="grid grid-cols-2 gap-4">  
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-5xl font-bold text-gray-800">
            {Math.round(data.main.temp)}°C
          </p>
          <p className="text-gray-600 mt-1">{data.weather[0].description}</p>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="text-xl font-semibold text-gray-300">{data.main.humidity}%</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Wind Speed</p>
            <p className="text-xl font-semibold text-gray-300">{data.wind.speed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );
};
