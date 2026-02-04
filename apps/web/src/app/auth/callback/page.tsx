'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Authentication failed. Please try again.');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      if (accessToken && refreshToken) {
        try {
          // Store tokens temporarily
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          // Fetch user data with the new token
          const response = await authApi.getMe();
          
          // Update auth store
          login(response.data.user, { accessToken, refreshToken });

          // Redirect to dashboard
          router.push('/dashboard');
        } catch {
          setError('Failed to complete authentication. Please try again.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setTimeout(() => router.push('/login'), 3000);
        }
      } else {
        setError('Invalid authentication response.');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-red-400">{error}</p>
            <p className="text-sm text-slate-500">Redirecting to login...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-indigo-500/20 flex items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="text-white">Completing authentication...</p>
            <p className="text-sm text-slate-500">Please wait while we log you in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
