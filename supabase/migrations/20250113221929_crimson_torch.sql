/*
  # Initial Schema Setup for Wine Meeting Manager

  1. New Tables
    - `profiles`
      - Extends auth.users with additional user information
      - Stores user profile data like name, company, and image
    - `products`
      - Stores wine product information
      - Includes details like name, type, region, and stock
    - `meetings`
      - Stores meeting information
      - Links to sales reps and products
    - `promotions`
      - Stores promotion campaigns
      - Links to products and includes sales tracking
    - `meeting_products`
      - Junction table for meetings and products
      - Allows multiple products per meeting
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  company text,
  portfolio text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  region text NOT NULL,
  trending boolean DEFAULT false,
  sales integer DEFAULT 0,
  stock integer DEFAULT 0,
  vintage text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meetings table
CREATE TABLE meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date timestamptz NOT NULL,
  sales_rep_id uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meeting_products junction table
CREATE TABLE meeting_products (
  meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (meeting_id, product_id)
);

-- Create promotions table
CREATE TABLE promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  type text NOT NULL CHECK (type IN ('discount', 'bundle', 'special-offer')),
  description text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  discount numeric,
  minimum_purchase integer,
  target_sales integer NOT NULL,
  current_sales integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Meetings are viewable by authenticated users"
  ON meetings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create meetings"
  ON meetings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own meetings"
  ON meetings FOR UPDATE
  TO authenticated
  USING (sales_rep_id = auth.uid());

CREATE POLICY "Meeting products are viewable by authenticated users"
  ON meeting_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Promotions are viewable by everyone"
  ON promotions FOR SELECT
  USING (true);