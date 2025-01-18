/*
  # Create Additional Admin User

  1. New Users
    - Create admin user in auth.users table
    - Create corresponding profile in profiles table

  2. Security
    - Uses secure password hashing
    - Sets up proper role and permissions
*/

-- Create test admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin2@winemeet.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false
);

-- Create corresponding profile
INSERT INTO profiles (
  id,
  name,
  role,
  company,
  portfolio,
  image_url
)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Admin User 2',
  'admin',
  'WineMeet',
  ARRAY['All Regions'],
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
);