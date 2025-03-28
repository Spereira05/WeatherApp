'use client';
import { useState } from "react";
import { Navbar, DisplayWeather, Spinner, FavoritesList } from "@/components";
import { WeatherState } from "@/lib/types";
import { fetchWeather } from "@/lib/services";
import { useSession } from "next-auth/react";


export default function Home() {
  const [weatherState, setWeatherState] = useState<WeatherState>({
    data: null,
    error: null,
    isLoading: false,
  });
  
  const { data: session } = useSession();
  
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
  
  const handleReset = () => {
    setWeatherState({
      data: null,
      error: null,
      isLoading: false,
    })
  }
  
  const handleFavoriteClick = (city: string, country: string) => {
    handleSearch(`${city}, ${country}`)
  }
  
  const isDetailsView = !!weatherState.data;
  
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen"> 
      <Navbar 
        onSearch={handleSearch} 
        isLoading={weatherState.isLoading} 
        onReset={handleReset}
      />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        {isDetailsView ? (
          // Weather details view - full width
          <div className="max-w-2xl mx-auto">
            {weatherState.data && <DisplayWeather data={weatherState.data} />}
          </div>
        ) : (
          // Home view with welcome message and favorites
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main welcome area */}
            <div className="lg:col-span-2">        
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
              
              {!weatherState.data && !weatherState.error && !weatherState.isLoading && (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to SPWeather</h2>
                  <p className="text-gray-600">
                    Search for a city above to see current weather conditions.
                  </p>
                </div>
              )}
            </div>
            
            {/* Favorites list */}
            <div className="lg:col-span-1">
              {session ? (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <FavoritesList onCityClick={handleFavoriteClick} />
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Favorites</h2>
                  <p className="text-gray-600 mb-4">
                    Sign in to save and view your favorite cities.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  ); 
}
