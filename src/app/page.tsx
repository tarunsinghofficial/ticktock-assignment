'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isAuthenticated, clearAuthData } from "@/utils/auth";

export default function Home() {
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    } else {
      setUser(null);
    }
  }, []);

  const handleSignIn = () => {
    router.push("/login");
  };

  const handleSignOut = () => {
    clearAuthData();
    setUser(null);
    router.refresh();
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl md:text-4xl lg:text-7xl font-semibold text-blue-600">Welcome to ticktock</h1>
      <div>
        {user ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-medium text-gray-700">Hello, {user.name}</span>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded"
            onClick={handleSignIn}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}
