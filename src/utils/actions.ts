// 'use server'

// import { createClient } from '@/utils/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'



// export async function login(formData: FormData) {
//   const supabase = await createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { error } = await supabase.auth.signInWithPassword(data)

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }

// export async function signup(formData: FormData) {
//   const supabase = await createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { error } = await supabase.auth.signUp(data)

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }






















'use server'

import { redirect } from "next/navigation"
import { createClient } from "./supabase/server"

const signInWith = (provider: any) => async() => {
    const supabase = await createClient()

    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`

    const {data, error} =
    await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: auth_callback_url,
        },
    })

    console.log(data)

    if (error) {
        console.log(error)
    }
    
    if (data.url) {
        redirect(data.url)
    } else {
        redirect('/error')
    }
    
}

const signInWithGoogle = signInWith('google')
export { signInWithGoogle }