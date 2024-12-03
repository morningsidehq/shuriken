import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@0.16.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  const { userId } = await req.json()

  try {
    // Get user details from Supabase
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!userProfile) {
      throw new Error('User profile not found')
    }

    // Send email using Resend
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: 'admin@yourdomain.com',
      subject: 'New Admin Role Request',
      html: `
        <p>A new admin role request has been submitted:</p>
        <ul>
          <li>Name: ${userProfile.first_name} ${userProfile.last_name}</li>
          <li>Email: ${userProfile.email}</li>
          <li>Agency: ${userProfile.user_group}</li>
        </ul>
      `,
    })

    return new Response(
      JSON.stringify({ message: 'Request submitted successfully' }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
