"use server";

import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto';

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
    // Return the error message instead of redirecting
    return { success: false, message: error.message };
  }

  revalidatePath('/', 'layout')
  // Redirect on success
  redirect('/dashboard')
}

// Email/Password Signup
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get('email') as string)?.toLowerCase();
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  
  if (!email) return redirect('/error?message=Missing email');

  // Validate password confirmation
  if (password !== confirmPassword) {
    redirect('/error?message=Passwords do not match')
  }

  if (!password || !confirmPassword) {
  redirect('/error?message=Missing password fields');
}

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { data: authData, error } = await supabase.auth.signUp({ // Capture authData
    email,
    password,
    options: {
    emailRedirectTo: `${baseUrl}/auth/callback`,
  }
  })

  if (error) {
    console.error('Signup error:', error)
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  if (authData?.user) {
    if (authData.user && authData.user.email) {
      await createUserProfile(authData.user as SupabaseUser);
    } else {
      console.error('User email is missing, cannot create user profile.');
    }
  }

  revalidatePath('/', 'layout')
  redirect('/check-email') // Redirect to email verification page
}

// OAuth Provider Login
const signInWith = (provider: "google" | "github") => async () => {
  const supabase = await createClient();

  // Use full URL for callback
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
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
  avatar_url?: string;
}

interface SupabaseUser {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
}

type UserUpdates = {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
};

function getGravatarUrl(email: string) {
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`; // 'd=identicon' provides a default image
}

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

  // Determine initial avatar_url (Gravatar or OAuth provider's avatar)
  const initialAvatarUrl = user.user_metadata?.avatar_url || (user.email ? getGravatarUrl(user.email) : null);

  if (!existingUser) {
    // Create new user profile
    const { error: insertError } = await supabase
      .from('users')
      .upsert([{
        id: user.id,
        email: user.email,
        username: user.user_metadata?.preferred_username || user.user_metadata?.user_name || user.email?.split('@')[0],
        first_name: user.user_metadata?.given_name || user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.family_name || user.user_metadata?.last_name || '',
        avatar_url: initialAvatarUrl,
        created_at: new Date().toISOString()
      }], { onConflict: 'id' });

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
    if (!existingUser.avatar_url && initialAvatarUrl) {
        updates.avatar_url = initialAvatarUrl;
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

export async function updateProfileDetails(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Not authenticated or no user found to update profile:', authError);
    redirect('/login?message=Authentication required'); // Or handle gracefully
  }

  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const avatarUrl = formData.get('avatar_url') as string; // Allow user to provide a URL

  const updates: UserUpdates = {};
  if (firstName) updates.first_name = firstName;
  if (lastName) updates.last_name = lastName;
  if (avatarUrl) updates.avatar_url = avatarUrl;


  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user profile details:', updateError);
      return { success: false, message: updateError.message };
    } else {
      revalidatePath('/dashboard', 'layout'); // Revalidate dashboard to reflect changes
      return { success: true, message: 'Profile updated successfully!' };
    }
  }
  return { success: true, message: 'No changes to update.' }; // No updates were provided
}