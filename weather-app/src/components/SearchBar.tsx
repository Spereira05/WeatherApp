'use client';
import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (city: string) => void }) {
  const [city, setCity] = useState('');

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(city.trim());
      }}
      className="flex gap-4"
    >
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        placeholder="Enter city name..."
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Search
      </button>
    </form>
  );
}