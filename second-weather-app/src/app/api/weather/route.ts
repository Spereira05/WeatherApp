import { WeatherData, WeatherError } from "@/lib/types/weather";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cityQuery = searchParams.get('city');
    const apiKey = process.env.WEATHER_API_KEY;
  
    if (!cityQuery) {
      return Response.json(
        { message: 'City parameter is required' } as
        WeatherError,
        { status: 400 }
      )
    }
    
    if (!apiKey) {
      return Response.json(
        { message: 'API key not configured' } as
        WeatherError,
        {status: 500 }
      )
    }
    
    let url;
    if (cityQuery.includes(',')) {
      const [city, country] = cityQuery.split(',');
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${country}&units=metric&appid=${apiKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityQuery)}&units=metric&appid=${apiKey}`;
      }
    try {
      const response = await fetch(url, {next: { revalidate: 300 } }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return Response.json(
          { message: error.message || 'City not found' } as WeatherError,
        { status: response.status }
        )
      }
  
      const data = (await response.json()) as WeatherData;
      return Response.json(data);
    } catch (error) {
      return Response.json(
        { message: 'Failed to fetch weather data' } as WeatherError,
        { status: 500 });
    }
  }