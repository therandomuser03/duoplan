"use server";

import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Email/Password Login
export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// Email/Password Signup
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Validate password confirmation
  if (password !== confirmPassword) {
    redirect('/error?message=Passwords do not match')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Signup error:', error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/check-email') // Redirect to email verification page
}

// OAuth Provider Login
const signInWith = (provider: "google" | "github") => async () => {
  const supabase = await createClient();

  // Use full URL for callback
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://duoplan.vercel.app/'
  const auth_callback_url = `${baseUrl}/auth/callback`;

  console.log('Attempting OAuth with:', provider)
  console.log('Callback URL:', auth_callback_url)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
      queryParams: {
        next: '/dashboard'
      }
    },
  });

  if (error) {
    console.error('OAuth error:', error);
    redirect('/error?message=' + encodeURIComponent(error.message));
  }

  if (data?.url) {
    console.log('Redirecting to:', data.url)
    redirect(data.url);
  } else {
    console.error('No OAuth URL returned')
    redirect("/error?message=OAuth URL not generated");
  }
};

export const signInWithGoogle = signInWith("google");
export const signInWithGithub = signInWith("github");

// Logout function
export async function logout() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout failed:', error.message);
    return;
  }

  // Redirect to home page
  redirect('/');
}

interface UserMetadata {
  preferred_username?: string;
  user_name?: string;
  given_name?: string;
  first_name?: string;
  family_name?: string;
  last_name?: string;
}

interface SupabaseUser {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
}

type UserUpdates = {
  first_name?: string;
  last_name?: string;
};


// Function to create or update user profile
export async function createUserProfile(user: SupabaseUser) {
  const supabase = await createClient();
  
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user:', fetchError);
    return;
  }

  if (!existingUser) {
    // Create new user profile
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        username: user.user_metadata?.preferred_username || user.user_metadata?.user_name || user.email?.split('@')[0],
        first_name: user.user_metadata?.given_name || user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.family_name || user.user_metadata?.last_name || '',
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error creating user profile:', insertError);
    } else {
      console.log('User profile created successfully');
    }
  } else {
    // Update existing user profile if needed
    const updates: UserUpdates = {};
    
    if (!existingUser.first_name && user.user_metadata?.given_name) {
      updates.first_name = user.user_metadata.given_name;
    }
    if (!existingUser.last_name && user.user_metadata?.family_name) {
      updates.last_name = user.user_metadata.family_name;
    }
    
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating user profile:', updateError);
      }
    }
  }
}