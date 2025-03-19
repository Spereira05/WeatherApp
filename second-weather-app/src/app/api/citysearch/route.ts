import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const apiKey = process.env.WEATHER_API_KEY;
  
  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }
  
  try {
    // Use OpenWeatherMap's geocoding API
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to search cities' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Format the response to include only relevant fields
    const cities = data.map((city: any, index: number) => ({
      id: index, // Assign a simple index as ID for the list
      name: city.name,
      country: city.country,
      state: city.state, // Include state/province if needed
      lat: city.lat,
      lon: city.lon
    }));
    
    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search cities' },
      { status: 500 }
    );
  }
}