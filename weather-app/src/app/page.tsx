'use client';
import { useState } from "react";
import { Navbar, DisplayWeather, Spinner } from "@/components";
import { WeatherData, WeatherState } from "@/lib/types";
import { fetchWeather } from "@/lib/services";

export default function Home() {
  const [weatherState, setWeatherState] = useState<WeatherState>({
    data: null,
    error: null,
    isLoading: false,
  });
  
  const handleSearch = async (city: string) => {
    setWeatherState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await fetchWeather(city);
      setWeatherState({
        data,
        error: null,
        isLoading: false,
      });
    } catch (err) {
      setWeatherState({
        data: null,
        error: err instanceof Error ? err.message : 'An error occurred',
        isLoading: false,
      });
    }
  };
  
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen"> 
      <Navbar onSearch={handleSearch} isLoading={weatherState.isLoading} />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-2xl mx-auto">        
          {weatherState.isLoading && (
            <div className="text-center p-4 text-blue-500">
              <Spinner />
            </div>
          )}

          {weatherState.error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm md:text-base">
              {weatherState.error}
            </div>
          )}
          
          {weatherState.data && <DisplayWeather data={weatherState.data} />}
        </div>
      </main>
    </div>
  ); 
}
