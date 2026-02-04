import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const adminEmail = 'admin@modaflicks.com';
    const adminPassword = 'Admin123!';

    const { data: existingUser, error: checkError } = await supabaseAdmin.auth.admin.listUsers();

    if (checkError) {
      throw checkError;
    }

    const userExists = existingUser.users.some((user: any) => user.email === adminEmail);

    if (userExists) {
      return new Response(
        JSON.stringify({
          message: 'Admin user already exists',
          email: adminEmail
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User'
      }
    });

    if (createError) {
      throw createError;
    }

    if (newUser.user) {
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: newUser.user.id,
          email: adminEmail,
          first_name: 'Admin',
          last_name: 'User',
          subscription_type: 'premium'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Admin user created successfully',
        email: adminEmail,
        password: adminPassword,
        note: 'Please save these credentials and change the password after first login'
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred creating the admin user'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
