import { createClient } from "./supabase/server";

export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface UserDisplayData {
  name: string;
  email: string;
  avatar: string;
}

export async function getCurrentUser(): Promise<UserDisplayData | null> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return null;
    }

    // Try to fetch user profile from 'users' table
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.warn("Profile not found or error occurred, creating one...");
      // Create profile and return the formatted user directly
      if (!user.email) {
        console.error("User email is undefined, cannot create profile.");
        return null;
      }
      return await createUserProfile({
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      });
    }

    return formatUserDisplayData(
      { ...user, email: user.email ?? "" },
      profile
    );
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

interface SupabaseAuthUser {
  id: string;
  email: string;
  user_metadata?: {
    avatar_url?: string;
    picture?: string;
    preferred_username?: string;
    user_name?: string;
    given_name?: string;
    first_name?: string;
    family_name?: string;
    last_name?: string;
    full_name?: string;
    name?: string;
  };
}

function formatUserDisplayData(
  authUser: SupabaseAuthUser,
  profile: UserProfile
): UserDisplayData {
  // Build display name
  let displayName = '';
  if (profile.first_name && profile.last_name) {
    displayName = `${profile.first_name} ${profile.last_name}`;
  } else if (profile.first_name) {
    displayName = profile.first_name;
  } else if (profile.username) {
    displayName = profile.username;
  } else {
    displayName = authUser.email?.split('@')[0] || 'User';
  }

  // Choose best available avatar
  const avatarUrl =
    profile.avatar_url ||
    authUser.user_metadata?.avatar_url ||
    authUser.user_metadata?.picture ||
    '';

  return {
    name: displayName,
    email: profile.email,
    avatar: avatarUrl,
  };
}

export async function createUserProfile(
  authUser: SupabaseAuthUser
): Promise<UserDisplayData | null> {
  try {
    const supabase = await createClient();
    const userData = authUser.user_metadata || {};

    // console.log("Creating user profile. Metadata:", userData);

    // Extract name
    let firstName = '';
    let lastName = '';

    if (userData.given_name) {
      firstName = userData.given_name;
    } else if (userData.first_name) {
      firstName = userData.first_name;
    } else if (userData.name || userData.full_name) {
      const name = userData.name || userData.full_name;
      const parts = (name ?? '').trim().split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    if (!firstName && !lastName) {
      const emailPrefix = authUser.email?.split('@')[0] || 'User';
      firstName = emailPrefix;
    }

    const userProfile: Partial<UserProfile> = {
  id: authUser.id,
  email: authUser.email,
  username: userData.user_name || userData.preferred_username || authUser.email?.split('@')[0],
  first_name: firstName || null,
  last_name: lastName || null,
  avatar_url: userData.avatar_url || userData.picture || null,
};

    // console.log("Upserting user profile:", userProfile);

    const { error } = await supabase
      .from("users")
      .upsert(userProfile, {
        onConflict: "id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Error creating/updating user profile:", error);
      return null;
    }

    // Return formatted result immediately
    return {
      name: `${firstName}${lastName ? ` ${lastName}` : ''}`,
      email: authUser.email,
      avatar: userProfile.avatar_url || '',
    };
  } catch (error) {
    console.error("Error in createUserProfile:", error);
    return null;
  }
}
