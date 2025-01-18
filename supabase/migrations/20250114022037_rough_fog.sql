/*
  # Add Sales Management Tables

  1. New Tables
    - `shops`
      - Basic shop information and location
    - `routes`
      - Sales routes information
    - `route_shops`
      - Junction table for routes and shops
    - `visits`
      - Track shop visits

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Create shops table
CREATE TABLE shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create routes table
CREATE TABLE routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  sales_rep_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create route_shops junction table
CREATE TABLE route_shops (
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  sequence_order integer NOT NULL,
  PRIMARY KEY (route_id, shop_id)
);

-- Create visits table
CREATE TABLE visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id),
  sales_rep_id uuid REFERENCES profiles(id),
  visit_date timestamptz NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Shops are viewable by authenticated users"
  ON shops FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Routes are viewable by authenticated users"
  ON routes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own routes"
  ON routes FOR ALL
  TO authenticated
  USING (sales_rep_id = auth.uid());

CREATE POLICY "Route shops are viewable by authenticated users"
  ON route_shops FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their route shops"
  ON route_shops FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM routes
      WHERE routes.id = route_shops.route_id
      AND routes.sales_rep_id = auth.uid()
    )
  );

CREATE POLICY "Visits are viewable by authenticated users"
  ON visits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own visits"
  ON visits FOR ALL
  TO authenticated
  USING (sales_rep_id = auth.uid());