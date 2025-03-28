'use client';
import { useState } from 'react';

interface CityOption {
  name: string;
  country: string;
  id: number;
}

interface CitySearchProps {
  onSelectCity: (city: string) => Promise<void>;
  isLoading: boolean;
}


export default function CitySearch({onSelectCity, isLoading}: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchCities = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSearchLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/citysearch?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search cities');
      }
      
      const data = await response.json();
      setCityOptions(data);
      
      // If there's only one result, immediately select it
      if (data.length === 1) {
        handleCitySelect(`${data[0].name},${data[0].country}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCityOptions([]);
    } finally {
      setSearchLoading(false);
    }
  };
  
  const handleCitySelect = (cityString: string) => {
    onSelectCity(cityString);
    setCityOptions([]);
  };

  return (
    <div className="w-full max-w-full md:max-w-md relative">
      <form onSubmit={searchCities} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="flex-1 p-2 md:p-3 text-gray-600 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
          disabled={isLoading || searchLoading}
        />
        <button
          type="submit"
          disabled={isLoading || searchLoading}
          className={`px-3 md:px-6 py-2 md:py-3 text-white rounded-lg transition-colors border-2
            ${(isLoading || searchLoading) ? 'bg-gray-400 border-gray-400 cursor-not-allowed' : 'bg-blue-400 border-blue-400 hover:bg-blue-500 hover:border-blue-500'}
          `}
        >
          {searchLoading ? 'Loading...' : 'Search'}
        </button>
      </form>
      
      {/* Display city options */}
      {cityOptions.length > 1 && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg">
          <ul>
            {cityOptions.map((city) => (
              <li 
                key={city.id}
                className="p-3 border-b hover:bg-blue-50 cursor-pointer text-gray-700"
                onClick={() => handleCitySelect(`${city.name},${city.country}`)}
              >
                {city.name}, {city.country} {city.state ? `(${city.state})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}