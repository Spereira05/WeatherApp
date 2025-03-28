'use client';
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { CitySearch } from "@/components/weather";
import { useSession, signOut, signIn } from "next-auth/react";

type NavbarProps = {
  onSearch: (city: string) => Promise<void>;
  isLoading: boolean;
  onReset: () => void
}   

// Main navigation bar component
// Contains the logo, search functionality, and authentication controls

export default function Navbar({ onSearch, isLoading, onReset }: NavbarProps) {
  
  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    window.location.reload();
  };
  
  const { data: session } = useSession();
  
    return (
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
        <div className="w-full flex flex-col md:flex-row justify-between items-center max-w-7xl px-3 py-4 mx-auto gap-4">
          <div onClick={handleReset} className="flex items-center gap-2 w-full md:w-auto cursor-pointer hover:opacity-80 transition-opacity">
            <h2 className="text-gray-500 text-2xl md:text-3xl">SPWeather</h2>
            <div className="text-blue-400 text-4xl md:text-5xl mt-1">
              <TiWeatherWindyCloudy />
            </div>
          </div>    
          {/* Search Section */}
          <div className="flex-1 w-full md:w-auto">
            <CitySearch onSelectCity={onSearch} isLoading={isLoading} />
          </div>
          
          {/* Auth Section */}
          <div className="w-full md:w-auto md:ml-4 mt-4 md:mt-0">
            {session ? (
              <div className="flex items-center justify-center md:justify-end gap-4">
                <span className="text-sm text-gray-600">Hi, {session.user?.name?.split(' ')[0]}</span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick= {() => signIn()}
                className="w-full md:w-auto px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center md:justify-start gap-2"
              >
                {/* <svg className="white w-2 h-2" viewBox="0 0 50 50">
                  <path d="M 26 2 C 13.308594 2 3 12.308594 3 25 C 3 37.691406 13.308594 48 26 48 C 35.917969 48 41.972656 43.4375 45.125 37.78125 C 48.277344 32.125 48.675781 25.480469 47.71875 20.9375 L 47.53125 20.15625 L 46.75 20.15625 L 26 20.125 L 25 20.125 L 25 30.53125 L 36.4375 30.53125 C 34.710938 34.53125 31.195313 37.28125 26 37.28125 C 19.210938 37.28125 13.71875 31.789063 13.71875 25 C 13.71875 18.210938 19.210938 12.71875 26 12.71875 C 29.050781 12.71875 31.820313 13.847656 33.96875 15.6875 L 34.6875 16.28125 L 41.53125 9.4375 L 42.25 8.6875 L 41.5 8 C 37.414063 4.277344 31.960938 2 26 2 Z M 26 4 C 31.074219 4 35.652344 5.855469 39.28125 8.84375 L 34.46875 13.65625 C 32.089844 11.878906 29.199219 10.71875 26 10.71875 C 18.128906 10.71875 11.71875 17.128906 11.71875 25 C 11.71875 32.871094 18.128906 39.28125 26 39.28125 C 32.550781 39.28125 37.261719 35.265625 38.9375 29.8125 L 39.34375 28.53125 L 27 28.53125 L 27 22.125 L 45.84375 22.15625 C 46.507813 26.191406 46.066406 31.984375 43.375 36.8125 C 40.515625 41.9375 35.320313 46 26 46 C 14.386719 46 5 36.609375 5 25 C 5 13.390625 14.386719 4 26 4 Z"></path>
               </svg> */}
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </nav>
    )
}