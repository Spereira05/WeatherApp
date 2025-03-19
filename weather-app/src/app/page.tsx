'use client';
import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherDisplay from '../components/WeatherDisplay';
import { WeatherData } from '../components/WeatherDisplay';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeather = async (city: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'City not found');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">SPweather</h1>
        
        {/* Search Bar Section - Always Visible */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <SearchBar onSearch={fetchWeather} />
          {isLoading && <p className="mt-4 text-blue-500">Loading...</p>}
        </div>

        {/* Error/Results Section */}
        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              Error: {error}
            </div>
          )}

          {weatherData && (
            <div className="animate-fade-in">
              <WeatherDisplay data={weatherData} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
