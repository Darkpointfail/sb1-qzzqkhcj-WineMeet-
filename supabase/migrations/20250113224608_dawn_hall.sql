/*
  # Add Availabilities Management

  1. New Tables
    - `availabilities`
      - Stores user availability slots
      - Each record represents a 30-minute block
      - Status can be 'available' or 'blocked'

  2. Security
    - Enable RLS
    - Users can only manage their own availabilities
*/

CREATE TABLE availabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text NOT NULL CHECK (status IN ('available', 'blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own availabilities"
  ON availabilities
  USING (auth.uid() = user_id);

-- Create unique constraint to prevent overlapping slots
CREATE UNIQUE INDEX availabilities_slot_idx ON availabilities (user_id, date, start_time);