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
  const next = searchParams.get('next') ?? '/user/account' // <-- MODIFIED DEFAULT REDIRECT

  if (code) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      console.log('User authenticated successfully:', data.user.email)

      // Create or update user profile in database
      try {
        await createUserProfile({
          id: data.user.id,
          email: data.user.email ?? '',
          user_metadata: data.user.user_metadata,
        })
        console.log('User profile created/updated')
      } catch (profileError) {
        console.error('Error creating user profile:', profileError)
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