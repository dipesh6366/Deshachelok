'use client';

import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { login, loginWithGoogle, loginWithTwitter, register, resetPassword, isAuthenticated, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setMessage('');
      setIsSubmitting(true);
      try {
        if (isForgotPassword) {
          await resetPassword(email);
          setMessage('Password reset email sent! Check your inbox.');
          setIsForgotPassword(false);
        } else if (isLogin) {
          await login(email, password);
        } else {
          await register(email, password);
        }
      } catch (err: any) {
        setError(err.message || 'Authentication failed');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleGoogleLogin = async () => {
      try {
        await loginWithGoogle();
      } catch (err: any) {
        setError(err.message || 'Google login failed');
      }
    };

    const handleTwitterLogin = async () => {
      try {
        await loginWithTwitter();
      } catch (err: any) {
        setError(err.message || 'X (Twitter) login failed');
      }
    };

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn size={32} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
            {isForgotPassword ? 'Reset Password' : isLogin ? 'Sign in Required' : 'Create an Account'}
          </h2>
          <p className="text-neutral-600 mb-6 text-center">
            {isForgotPassword
              ? 'Enter your email to receive a password reset link.'
              : 'You need to be signed in to access the editorial panel and publish articles.'}
          </p>

          {!isForgotPassword && (
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={handleTwitterLogin}
                className="w-full flex items-center justify-center gap-3 bg-black border border-transparent rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Continue with X
              </button>

              <div className="flex items-center my-2">
                <div className="flex-grow border-t border-neutral-200"></div>
                <span className="flex-shrink-0 mx-4 text-neutral-400 text-sm">Or</span>
                <div className="flex-grow border-t border-neutral-200"></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
            {message && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{message}</div>}

            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="you@example.com"
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-neutral-700">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError('');
                        setMessage('');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required={!isForgotPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? 'Please wait...' : isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <div className="text-center mt-4">
              {isForgotPassword ? (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Back to sign in
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
