import { WeatherData } from "@/lib/types/weather";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

// GET handler for weather data
// Fetches weather information for a specific city from OpenWeatherMap API


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cityQuery = searchParams.get('city');
    const apiKey = process.env.WEATHER_API_KEY;
  
    if (!cityQuery) {
      return errorResponse('City parameter is required', 400)
    }
    
    if (!apiKey) {
      return errorResponse('API key not configured', 500)
    }
    
    let url;
    // Handle city with country code format
    if (cityQuery.includes(',')) {
      const [city, country] = cityQuery.split(',');
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${country}&units=metric&appid=${apiKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityQuery)}&units=metric&appid=${apiKey}`;
      }
    try {
      const response = await fetch(url, {next: { revalidate: 300 } });
      
      if (!response.ok) {
        const error = await response.json();
        return errorResponse(error.message || 'City not found', response.status);
      }
  
      const data = await response.json() as WeatherData;
      if (!data.sys || !data.sys.country) {
        console.error("Missing required fields in OpenWeatherMap response:", data);
        return errorResponse('Weather data is incomplete', 500);
      }
      return successResponse(data);
    } catch (error) {
      return errorResponse('Failed to fetch weather data', 500); 
    }
  }