'use client';

import { useAuth } from '../_contexts/AuthContext';

export default function Header() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-gray-800 border-b border-gray-600">
      <div className="flex items-center">
        <h1 className="text-white font-medium">Kommander</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-gray-300 mr-2">
            Welcome, {user.username}
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}