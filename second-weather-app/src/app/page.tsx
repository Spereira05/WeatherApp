'use client';
import { useState } from "react";
import Navbar from "../components/Navbar";
import DisplayWeather from "../components/DisplayWeather"
import Spinner from "../components/ui/Spinner"
import { WeatherData, WeatherState } from "@/lib/types/weather";

export default function Home() {

  const [weatherState, setWeatherState] = useState<WeatherState>({
    data: null,
    error: null,
    isLoading: false,
  });
  
  const fetchWeather = async (city: string) => {
    setWeatherState((prev) => ({ ...prev, isLoading: true, error: null })
    );
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch weather data');
      }
    
      setWeatherState({
        data: data as WeatherData,
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
      <Navbar onSearch={fetchWeather} isLoading={weatherState.isLoading} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">        
        {weatherState.isLoading && (
          <div className="text-center p-4 text-blue-500">
            <Spinner />
          </div>
        )}

        {weatherState.error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {weatherState.error}
          </div>
        )}
        {weatherState.data && <DisplayWeather data={weatherState.data}
        />}
        </div>
      </main>
    </div>
  ); 
};

