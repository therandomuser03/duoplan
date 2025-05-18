// Middleware approach to sync users between Clerk and Supabase

import { clerkMiddleware } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role key for admin operations

// Create middleware function that runs on auth state changes
type ClerkAuth = {
  userId?: string;
  [key: string]: any;
};

const middleware = clerkMiddleware(async (auth: ClerkAuth, req: any) => {
  // You may need to adjust how you get the userId depending on your Clerk setup
  const { userId } = auth || {};

  // Only proceed if the user is signed in
  if (!userId) return;

  try {
    // Initialize Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    });

    // Fetch user data from Clerk using the SDK
    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data from Clerk');
    }

    const userData = await response.json();

    // Format user data for Supabase
    const supabaseUser = {
      id: userData.id,
      email: userData.email_addresses?.[0]?.email_address || '',
      username: userData.username || '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      created_at: new Date().toISOString(),
    };

    // Upsert the user in Supabase
    const { error } = await supabase
      .from('users')
      .upsert(supabaseUser, { 
        onConflict: 'id'
      });

    if (error) {
      console.error('Error syncing user to Supabase:', error);
    }
  } catch (error) {
    console.error('Error in Clerk-Supabase middleware:', error);
  }
});

export default middleware;

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};