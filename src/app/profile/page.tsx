"use client"

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProfileEditor() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Profile state
  const [profile, setProfile] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    // Add any additional profile fields you want to store
    bio: '',
    location: '',
    website: '',
    avatar_url: ''
  });

  // Load user profile data from Supabase
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Try to get existing profile from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" in PostgREST
          console.error('Error fetching user profile:', error);
          setMessage('Failed to load profile');
          return;
        }

        // If we found a profile, populate the form
        if (data) {
          setProfile({
            username: data.username || user.username || '',
            first_name: data.first_name || user.firstName || '',
            last_name: data.last_name || user.lastName || '',
            email: data.email || user.primaryEmailAddress?.emailAddress || '',
            bio: data.bio || '',
            location: data.location || '',
            website: data.website || '',
            avatar_url: data.avatar_url || ''
          });
        } else {
          // Use Clerk data for initial values
          setProfile({
            username: user.username || '',
            first_name: user.firstName || '',
            last_name: user.lastName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
            bio: '',
            location: '',
            website: '',
            avatar_url: ''
          });
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        setMessage('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, isLoaded]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Save profile to Supabase
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsSaving(true);
      setMessage('');
      
      // Prepare the user data
      const userData = {
        id: user.id,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString()
      };

      // Upsert the user data
      const { error } = await supabase
        .from('users')
        .upsert(userData, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        setMessage('Failed to update profile');
      } else {
        setMessage('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setMessage('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to edit your profile</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            name="username"
            type="text"
            value={profile.username}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="first_name"
            name="first_name"
            type="text"
            value={profile.first_name}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="last_name"
            name="last_name"
            type="text"
            value={profile.last_name}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
            id="email"
            name="email"
            type="email"
            value={profile.email}
            readOnly
          />
          <p className="text-sm text-gray-500 mt-1">Email can only be changed through your account settings</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="bio"
            name="bio"
            rows={3}
            value={profile.bio}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            name="location"
            type="text"
            value={profile.location}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="website">
            Website
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="website"
            name="website"
            type="url"
            value={profile.website}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}