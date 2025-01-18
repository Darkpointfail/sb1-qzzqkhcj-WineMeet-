/*
  # Add Role-based Authentication

  1. Changes
    - Add role column to profiles table
    - Add role-based policies
    - Update existing policies

  2. Security
    - Restrict access based on user role
    - Add role-specific policies
*/

-- Add role to profiles
ALTER TABLE profiles
ADD COLUMN role text NOT NULL CHECK (role IN ('admin', 'sales_rep')) DEFAULT 'sales_rep';

-- Update policies for role-based access
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Products policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

CREATE POLICY "Products are viewable by authenticated users"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Promotions policies
DROP POLICY IF EXISTS "Promotions are viewable by everyone" ON promotions;

CREATE POLICY "Promotions are viewable by authenticated users"
  ON promotions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage promotions"
  ON promotions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );