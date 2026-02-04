'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Github, Info } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { authApi, api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [oauthStatus, setOauthStatus] = useState<{ google: boolean; github: boolean } | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Fetch OAuth configuration status on mount
  useEffect(() => {
    const fetchOAuthStatus = async () => {
      try {
        const response = await api.get('/api/auth/oauth-status');
        setOauthStatus(response.data);
      } catch {
        // If we can't fetch, assume OAuth is not configured
        setOauthStatus({ google: false, github: false });
      }
    };
    fetchOAuthStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login(formData);
      login(response.data.user, response.data.tokens);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthClick = (provider: 'google' | 'github') => {
    if (oauthStatus && !oauthStatus[provider]) {
      setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth is not configured. Please add credentials to the server .env file.`);
      return;
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">CB</span>
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your CollabBoard account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative group">
              <Button
                variant="outline"
                onClick={() => handleOAuthClick('google')}
                disabled={oauthStatus !== null && !oauthStatus.google}
                className={oauthStatus !== null && !oauthStatus.google ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                </svg>
                Google
              </Button>
              {oauthStatus !== null && !oauthStatus.google && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-700 text-xs text-slate-300 px-2 py-1 rounded whitespace-nowrap">
                  <Info className="h-3 w-3 inline mr-1" />
                  Not configured
                </div>
              )}
            </div>
            <div className="relative group">
              <Button
                variant="outline"
                onClick={() => handleOAuthClick('github')}
                disabled={oauthStatus !== null && !oauthStatus.github}
                className={oauthStatus !== null && !oauthStatus.github ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
              {oauthStatus !== null && !oauthStatus.github && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-700 text-xs text-slate-300 px-2 py-1 rounded whitespace-nowrap">
                  <Info className="h-3 w-3 inline mr-1" />
                  Not configured
                </div>
              )}
            </div>
          </div>

          {oauthStatus && (!oauthStatus.google || !oauthStatus.github) && (
            <p className="mt-4 text-xs text-center text-slate-500">
              OAuth providers need to be configured in the server environment.
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
