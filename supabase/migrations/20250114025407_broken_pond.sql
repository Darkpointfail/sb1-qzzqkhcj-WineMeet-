/*
  # Add SAQ Dépôt Staff Members

  1. New Data
    - Create profiles for SAQ Dépôt staff members
    - Assign staff members to SAQ Dépôt
    - Add availability slots for new staff
*/

-- Create profiles for SAQ Dépôt staff
INSERT INTO auth.users (id, email)
VALUES 
  ('f1e2d3c4-b5a6-4c3b-9d8e-7f6a5b4c3d2e', 'isabelle.dubois@saq.com'),
  ('e2d3c4b5-a6f7-4d3c-8e9f-6a5b4c3d2e1f', 'marc.tremblay@saq.com'),
  ('d3c4b5a6-f7e8-4e3d-9f0a-5b4c3d2e1f0a', 'julie.rousseau@saq.com'),
  ('c4b5a6d7-e8f9-4f3e-0a1b-4c3d2e1f0a9b', 'philippe.gagnon@saq.com');

-- Create their profiles
INSERT INTO profiles (id, name, role, company)
VALUES
  ('f1e2d3c4-b5a6-4c3b-9d8e-7f6a5b4c3d2e', 'Isabelle Dubois', 'sales_rep', 'SAQ'),
  ('e2d3c4b5-a6f7-4d3c-8e9f-6a5b4c3d2e1f', 'Marc Tremblay', 'sales_rep', 'SAQ'),
  ('d3c4b5a6-f7e8-4e3d-9f0a-5b4c3d2e1f0a', 'Julie Rousseau', 'sales_rep', 'SAQ'),
  ('c4b5a6d7-e8f9-4f3e-0a1b-4c3d2e1f0a9b', 'Philippe Gagnon', 'sales_rep', 'SAQ');

-- Assign them to SAQ Dépôt with specific roles
INSERT INTO shop_staff (shop_id, staff_id, role)
VALUES
  ('b2a1c3d4-f5e6-4b3a-9c8d-1e2f3a4b5c6d', 'f1e2d3c4-b5a6-4c3b-9d8e-7f6a5b4c3d2e', 'Wine Specialist'),
  ('b2a1c3d4-f5e6-4b3a-9c8d-1e2f3a4b5c6d', 'e2d3c4b5-a6f7-4d3c-8e9f-6a5b4c3d2e1f', 'Store Manager'),
  ('b2a1c3d4-f5e6-4b3a-9c8d-1e2f3a4b5c6d', 'd3c4b5a6-f7e8-4e3d-9f0a-5b4c3d2e1f0a', 'Wine Advisor'),
  ('b2a1c3d4-f5e6-4b3a-9c8d-1e2f3a4b5c6d', 'c4b5a6d7-e8f9-4f3e-0a1b-4c3d2e1f0a9b', 'Spirits Specialist');

-- Add availability slots for the next 7 days for all new staff
WITH RECURSIVE dates AS (
  SELECT CURRENT_DATE as date
  UNION ALL
  SELECT date + 1
  FROM dates
  WHERE date < CURRENT_DATE + 7
),
times AS (
  SELECT '09:00:00'::time as start_time, '10:00:00'::time as end_time
  UNION ALL SELECT '10:00:00'::time, '11:00:00'::time
  UNION ALL SELECT '11:00:00'::time, '12:00:00'::time
  UNION ALL SELECT '14:00:00'::time, '15:00:00'::time
  UNION ALL SELECT '15:00:00'::time, '16:00:00'::time
  UNION ALL SELECT '16:00:00'::time, '17:00:00'::time
)
INSERT INTO staff_availability (staff_id, date, start_time, end_time, is_available)
SELECT 
  p.id,
  d.date,
  t.start_time,
  t.end_time,
  -- Randomly make some slots unavailable
  random() > 0.2
FROM profiles p
CROSS JOIN dates d
CROSS JOIN times t
WHERE p.id IN (
  'f1e2d3c4-b5a6-4c3b-9d8e-7f6a5b4c3d2e',
  'e2d3c4b5-a6f7-4d3c-8e9f-6a5b4c3d2e1f',
  'd3c4b5a6-f7e8-4e3d-9f0a-5b4c3d2e1f0a',
  'c4b5a6d7-e8f9-4f3e-0a1b-4c3d2e1f0a9b'
)
ORDER BY p.id, d.date, t.start_time;