/*
  # Add Test Data for Booking System

  1. Test Data
    - Sample shops
    - Staff assignments
    - Availability slots
*/

-- Insert test shops
INSERT INTO shops (id, name, address, latitude, longitude) VALUES
  ('d1c3b2a1-e4f5-4a3b-8c9d-0e1f2a3b4c5d', 'SAQ Signature', '440 Boulevard du Séminaire Nord, Saint-Jean-sur-Richelieu', 45.316064, -73.261741),
  ('b2a1c3d4-f5e6-4b3a-9c8d-1e2f3a4b5c6d', 'SAQ Dépôt', '2405 Boulevard des Récollets, Trois-Rivières', 46.358439, -72.578131),
  ('a1b2c3d4-e5f6-4a3b-8c9d-2e3f4a5b6c7d', 'SAQ Sélection', '1255 Boulevard Wallberg, Dolbeau-Mistassini', 48.879458, -72.228354);

-- Insert staff assignments (using existing profile IDs)
INSERT INTO shop_staff (shop_id, staff_id, role) 
SELECT 
  'd1c3b2a1-e4f5-4a3b-8c9d-0e1f2a3b4c5d',
  id,
  'Wine Advisor'
FROM profiles 
WHERE role = 'sales_rep'
LIMIT 1;

-- Insert availability slots for the next 7 days
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
  staff_id,
  d.date,
  t.start_time,
  t.end_time,
  true
FROM shop_staff
CROSS JOIN dates d
CROSS JOIN times t
WHERE d.date > CURRENT_DATE
ORDER BY d.date, t.start_time;