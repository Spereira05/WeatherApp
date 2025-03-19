'use client';
import { TiWeatherWindyCloudy } from "react-icons/ti";
import CitySearch from "./CitySearch";
import { login } from "@/lib/actions/auth"
import { useSession } from "next-auth/react";

type NavbarProps = {
  onSearch: (city: string) => Promise<void>;
  isLoading: boolean;
}     

export default function Navbar({ onSearch, isLoading }: NavbarProps) {
  
  const { data: session } = useSession();
  
    return (
        <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
            <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
                <div className="flex items-center gap-2">
                    <h2 className="text-gray-500 text-3xl ">SPWeather</h2>
                    <div className="text-blue-400 text-5xl mt-1">
                        <TiWeatherWindyCloudy />
                    </div>
                </div>    
                <div className="flex-1 flex justify-end">
                    <CitySearch onSelectCity={ onSearch }
                    isLoading={ isLoading } />
                </div>
                <div className="ml-4">
                  {session ? (
                    <div className="flex items-center gap-4">
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
                      onClick={() => login("google")}
                      className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                        <path fill="none" d="M1 1h22v22H1z" />
                      </svg>
                      Sign in with Google
                    </button>
                  )}
                </div>
            </div>
        </nav>
    )
}