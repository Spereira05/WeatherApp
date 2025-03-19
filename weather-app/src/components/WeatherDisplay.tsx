export interface WeatherData {
    name: string;
    main: { temp: number; humidity: number };
    wind: { speed: number };
    weather: [{ description: string; icon: string }];
  }
  
  export default function WeatherDisplay({ data }: { data: any }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{data.name}</h2>
          <img
            src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt={data.weather[0].description}
            className="w-20 h-20"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-5xl font-bold text-gray-800">
              {Math.round(data.main.temp)}°C
            </p>
            <p className="text-gray-600 mt-1">{data.weather[0].description}</p>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-xl font-semibold">{data.main.humidity}%</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="text-xl font-semibold">{data.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      </div>
    );
  }