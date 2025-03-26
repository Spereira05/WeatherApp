import { WeatherData } from '../types';

export async function fetchWeather(city: string): Promise<WeatherData> {
  const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.error || 'Failed to fetch weather data');
  }
  
  const weatherData = responseData.data || responseData;
  
  if (!weatherData.name || !weatherData.sys) {
    console.error("Invalid weather data format:",weatherData);
    throw new Error("Weather data is in an unexpected format");
  }
  
  return weatherData;
}

export async function searchCities(query: string) {
  const response = await fetch(`/api/citysearch?q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error('Failed to search cities');
  }
  
  return await response.json();
}