'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/toast';
import { Copy, Heart, Loader2 } from 'lucide-react';

export default function Connect() {
  const [partnerCode, setPartnerCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchMyCode = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setMyCode(user.id);
          // Check if user already has a partner
          const { data: pair } = await supabase
            .from('pairs')
            .select('*')
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
            .single();
          
          if (pair) {
            router.push('/calendar');
          }
        }
      } catch (error) {
        console.error('Error fetching user code:', error);
        setToast({
          message: error instanceof Error ? error.message : 'Failed to load user information',
          type: 'error'
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMyCode();
  }, [supabase, router]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(myCode);
      setToast({ message: 'Code copied to clipboard!', type: 'success' });
    } catch (error) {
      setToast({ 
        message: error instanceof Error ? error.message : 'Failed to copy code', 
        type: 'error' 
      });
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (partnerCode === user.id) {
        throw new Error('You cannot connect with yourself');
      }

      // First, check if the partner exists in auth.users
      const { data: partner, error: partnerError } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('id', partnerCode)
        .single();

      if (partnerError) {
        console.error('Partner search error:', partnerError);
        throw new Error('Invalid partner code');
      }

      if (!partner) {
        throw new Error('Partner not found');
      }

      // Check if users are already connected
      const { data: existingPair, error: pairError } = await supabase
        .from('pairs')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single();

      if (pairError && pairError.code !== 'PGRST116') {
        console.error('Pair check error:', pairError);
        throw new Error('Error checking existing connection');
      }

      if (existingPair) {
        throw new Error('You already have a partner connection');
      }

      // Create the pair
      const { error: createError } = await supabase
        .from('pairs')
        .insert([
          {
            user1_id: user.id,
            user2_id: partner.id,
            created_at: new Date().toISOString(),
          },
        ]);

      if (createError) {
        console.error('Pair creation error:', createError);
        throw createError;
      }

      setToast({ message: `Successfully connected with ${partner.full_name}!`, type: 'success' });
      setTimeout(() => {
        router.push('/calendar');
      }, 1500);
    } catch (error) {
      console.error('Connection error:', error);
      setToast({ 
        message: error instanceof Error ? error.message : 'Failed to connect with partner', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="w-full max-w-md">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Connect with Your Partner
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Share your code or enter your partner&apos;s code to create a connection
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Your Partner Code Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Your Partner Code</h3>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm font-mono text-gray-800">
                  {myCode || 'Loading...'}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-3 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Share this code with your partner to connect your accounts
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-b from-indigo-50 to-white text-gray-500">
                  or enter your partner&apos;s code
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <label htmlFor="partnerCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Partner&apos;s Code
                  </label>
                  <input
                    id="partnerCode"
                    name="partnerCode"
                    type="text"
                    required
                    className="block w-full rounded-md border-gray-200 shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm font-mono"
                    placeholder="Enter your partner&apos;s code"
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Connecting...
                    </>
                  ) : (
                    'Connect with Partner'
                  )}
                </button>
              </form>
            </div>

            <div className="text-center space-y-3">
              <Link
                href="/calendar"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 block"
              >
                Skip for now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 