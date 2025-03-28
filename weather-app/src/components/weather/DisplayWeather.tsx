'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from "react";
import { WeatherData } from "@/lib/types";

interface DisplayWeatherProps {
  data: WeatherData | { data: WeatherData }
}
  
export default function DisplayWeather({ data }: DisplayWeatherProps) {

  const weatherData = 'data' in data ? data.data : data;
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const { data: session } = useSession();

  const checkFavoriteStatus = async () => {
    if (!weatherData.name || !weatherData.sys?.country) { 
      console.error("Missing required weather data properties:", weatherData);
      return { isFavorite: false, favoriteId: null };
    }
    try {
      const response = await fetch(`/api/favorites?city=${encodeURIComponent(weatherData.name)}&country=${weatherData.sys.country}`);
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
    if (weatherData?.name && weatherData?.sys?.country) {
      checkFavoriteStatus();
    }       
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData?.name, weatherData?.sys?.country]);

  const toggleFavorite = async () => {
    if (!session) { 
      setMessage({
        text: "Please sign in to add favorites",
        type: "error"
      });
      return;
    }
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
        setMessage({ text: `${weatherData.name} removed from favorites!`, type: 'success' });
      } else {
        console.log("Adding to favorites:", { name: weatherData.name, country: weatherData.sys.country });
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: weatherData.name, country: weatherData.sys.country }),
        });

        if (!response.ok) {
          let errorMsg = 'Failed to add to favorites';
          
          try {
            // Try to parse the error response as JSON
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch (parseError) {
            // If parsing fails, try to get text
            try {
              errorMsg = await response.text();
            } catch (textError) {
              // If all fails, use the default error message
              console.error("Could not parse error response", textError);
            }
          }
          
          throw new Error(errorMsg);
        }

        const result = await response.json();
        setFavoriteId(result._id);
        setIsFavorite(true);
        setMessage({
          text: `${weatherData.name} added to favorites`,
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
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
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">{weatherData.name}</h2>
          <p className="text-sm text-gray-600 text-center md:text-left">{weatherData.sys.country}</p>
        </div>        
        <button
          onClick={toggleFavorite}
          className={`w-full md:w-auto px-4 py-2 ${
            isFavorite 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-400 hover:bg-blue-600'
          } text-white rounded-lg transition-colors`}
        > 
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  
        <div className="p-4 bg-gray-50 rounded-lg text-center md:text-left">
          <p className="text-4xl md:text-5xl font-bold text-gray-800">
            {Math.round(weatherData.main.temp)}°C
          </p>
          <p className="text-gray-600 mt-1">{weatherData.weather[0].description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="text-xl font-semibold text-gray-300">{weatherData.main.humidity}%</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Wind Speed</p>
            <p className="text-xl font-semibold text-gray-300">{weatherData.wind.speed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );
};
