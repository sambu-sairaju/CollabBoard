'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export function Navbar({ onMenuClick, isSidebarCollapsed }: NavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      // Clear local state and storage
      logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setShowUserMenu(false);
      setIsLoggingOut(false);
      // Redirect to login
      router.push('/login');
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-slate-900/95 backdrop-blur border-b border-slate-800 transition-all duration-300',
        isSidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Menu button (mobile) and Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search anything... (⌘K)"
                className="w-80 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right side - Notifications and User */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Avatar
                src={user?.avatar}
                name={user?.name || 'User'}
                size="sm"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-xs text-slate-500">{user?.email || 'Not logged in'}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-medium text-white">{user?.name || 'Guest'}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Settings
                </a>
                <a
                  href="/settings/profile"
                  className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Your Profile
                </a>
                <hr className="my-1 border-slate-700" />
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

