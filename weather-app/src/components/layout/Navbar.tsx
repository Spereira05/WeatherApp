'use client';
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { CitySearch } from "@/components/weather";
import { useSession, signOut, signIn } from "next-auth/react";

type NavbarProps = {
  onSearch: (city: string) => Promise<void>;
  isLoading: boolean;
}     

export default function Navbar({ onSearch, isLoading }: NavbarProps) {
  
  const handleSignIn = async () => {
    try {
      console.log("Starting sign-in process...");
      // Adding redirect: false allows us to handle any errors
      const result = await signIn("google", { callbackUrl: '/', redirect: false });
      console.log("Sign-in result:", result);
      
      if (result?.error) {
        console.error("Sign-in returned an error:", result.error);
      }
    } catch (error) {
      console.error("Exception during sign-in:", error);
    }
  };
  
  const { data: session } = useSession();
  
    return (
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
        <div className="w-full flex flex-col md:flex-row justify-between items-center max-w-7xl px-3 py-4 mx-auto gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <h2 className="text-gray-500 text-2xl md:text-3xl">SPWeather</h2>
            <div className="text-blue-400 text-4xl md:text-5xl mt-1">
              <TiWeatherWindyCloudy />
            </div>
          </div>    
          <div className="flex-1 w-full md:w-auto">
            <CitySearch onSelectCity={onSearch} isLoading={isLoading} />
          </div>
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
                onClick={handleSignIn}
                className="w-full md:w-auto px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center md:justify-start gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  {/* SVG path */}
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </nav>
    )
}