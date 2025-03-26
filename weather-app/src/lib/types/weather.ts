   export interface WeatherData {
     name: string;
     sys: {
       country: string;
     }
     main: {
       temp: number;
       humidity: number;
     };
     wind: {
       speed: number;
     };
     weather: Array<{
       description: string;
       icon: string;
     }>;
   }

   export interface WeatherError {
     message: string;
     status?: number;
   }

   export interface WeatherState {
     data: WeatherData | null;
     error: string | null;
     isLoading: boolean;
   }