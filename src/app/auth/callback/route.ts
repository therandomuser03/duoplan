// app/auth/callback/route.ts

import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
// Import createUserProfile from actions.ts where it's defined to handle avatar_url and Gravatar logic.
// If you definitively decided to keep createUserProfile in utils/user.ts, ensure that version
// is the comprehensive one including avatar_url and Gravatar.
import { createUserProfile } from '@/utils/actions' // <-- MODIFIED IMPORT PATH

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Changed default redirect to /user/account to allow users to complete their profile
  const next = searchParams.get('next') ?? '/dashboard' // <-- MODIFIED DEFAULT REDIRECT

  if (code) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      console.log('User authenticated successfully:', data.user.email)
      console.log('User metadata:', data.user.user_metadata)

      // Create or update user profile in database
      try {
        const userProfile = await createUserProfile({
          id: data.user.id,
          email: data.user.email ?? '',
          user_metadata: data.user.user_metadata,
        })
        
        if (!userProfile) {
          console.error('Failed to create user profile')
          return NextResponse.redirect(`${origin}/error?message=Failed to create user profile`)
        }
        
        console.log('User profile created/updated successfully:', userProfile)
      } catch (profileError) {
        console.error('Error creating user profile:', profileError)
        return NextResponse.redirect(`${origin}/error?message=Error creating user profile`)
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}