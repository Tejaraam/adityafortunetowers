-- Run this query in the Supabase SQL Editor to create an admin user
-- Make sure to replace 'admin@adityafortunetowers.com' and 'SecurePassword123!' with your desired credentials

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'admin@adityafortunetowers.com',
  crypt('SecurePassword123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- After inserting, you might want to insert into public.profiles or any other custom tables if you use them, but for Supabase auth, the above is enough to let you login.
