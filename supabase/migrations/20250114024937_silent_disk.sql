/*
  # Booking System Schema

  1. New Tables
    - `shop_staff` - Junction table for staff members assigned to shops
      - `shop_id` (uuid, references shops)
      - `staff_id` (uuid, references profiles)
      - `role` (text)
    - `staff_availability` - Staff member availability slots
      - `id` (uuid, primary key)
      - `staff_id` (uuid, references profiles)
      - `date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `is_available` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create shop_staff junction table
CREATE TABLE shop_staff (
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (shop_id, staff_id)
);

-- Create staff_availability table
CREATE TABLE staff_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE shop_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_availability ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Shop staff assignments are viewable by authenticated users"
  ON shop_staff FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff availability is viewable by authenticated users"
  ON staff_availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage their own availability"
  ON staff_availability FOR ALL
  TO authenticated
  USING (staff_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_shop_staff_shop_id ON shop_staff(shop_id);
CREATE INDEX idx_shop_staff_staff_id ON shop_staff(staff_id);
CREATE INDEX idx_staff_availability_staff_id ON staff_availability(staff_id);
CREATE INDEX idx_staff_availability_date ON staff_availability(date);