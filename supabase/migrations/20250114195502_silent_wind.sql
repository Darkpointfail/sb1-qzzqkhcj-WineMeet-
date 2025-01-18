/*
  # Add SAQ Locations

  1. New Data
    - Adds multiple SAQ locations across Quebec
    - Each location includes:
      - Name
      - Full address
      - Precise latitude/longitude coordinates
*/

-- Insert SAQ locations
INSERT INTO shops (id, name, address, latitude, longitude) VALUES
  -- Montreal Region
  (gen_random_uuid(), 'SAQ Sélection Place Versailles', '7275 Rue Sherbrooke Est, Montréal, QC H1N 1E9', 45.5867, -73.5477),
  (gen_random_uuid(), 'SAQ Classique Atwater', '2681 Rue Notre-Dame Ouest, Montréal, QC H3J 1N9', 45.4785, -73.5775),
  (gen_random_uuid(), 'SAQ Express Jean-Talon', '440 Rue Jean-Talon Est, Montréal, QC H2R 1S6', 45.5395, -73.6155),
  
  -- Quebec City Region
  (gen_random_uuid(), 'SAQ Sélection Lebourgneuf', '1500 Boulevard Lebourgneuf, Québec, QC G2K 2N8', 46.8372, -71.2815),
  (gen_random_uuid(), 'SAQ Classique Place Sainte-Foy', '2450 Boulevard Laurier, Québec, QC G1V 2L1', 46.7754, -71.2825),
  
  -- Laval
  (gen_random_uuid(), 'SAQ Dépôt Laval', '1950 Boulevard Le Corbusier, Laval, QC H7S 2K1', 45.5608, -73.7498),
  (gen_random_uuid(), 'SAQ Sélection Centropolis', '1799 Avenue Pierre-Péladeau, Laval, QC H7T 2Y5', 45.5583, -73.7492),
  
  -- Gatineau
  (gen_random_uuid(), 'SAQ Sélection Les Promenades', '1100 Boulevard Maloney Ouest, Gatineau, QC J8T 6G3', 45.4777, -75.7088),
  
  -- Sherbrooke
  (gen_random_uuid(), 'SAQ Dépôt Sherbrooke', '3025 Boulevard de Portland, Sherbrooke, QC J1L 2Y7', 45.4003, -71.9577),
  
  -- Saguenay
  (gen_random_uuid(), 'SAQ Sélection Chicoutimi', '1283 Boulevard Talbot, Chicoutimi, QC G7H 4C1', 48.4195, -71.0538);

-- Add some sample staff assignments
WITH new_shops AS (
  SELECT id FROM shops WHERE created_at > NOW() - interval '1 minute'
)
INSERT INTO shop_staff (shop_id, staff_id, role)
SELECT 
  s.id,
  p.id,
  CASE floor(random() * 3)
    WHEN 0 THEN 'Wine Specialist'
    WHEN 1 THEN 'Store Manager'
    ELSE 'Wine Advisor'
  END
FROM new_shops s
CROSS JOIN profiles p
WHERE p.role = 'sales_rep'
ORDER BY random()
LIMIT 20;

-- Add availability slots for new staff assignments
WITH new_assignments AS (
  SELECT shop_staff.staff_id
  FROM shop_staff
  WHERE created_at > NOW() - interval '1 minute'
),
dates AS (
  SELECT generate_series(
    CURRENT_DATE,
    CURRENT_DATE + interval '14 days',
    interval '1 day'
  )::date as date
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
  a.staff_id,
  d.date,
  t.start_time,
  t.end_time,
  random() > 0.2 -- 80% chance of being available
FROM new_assignments a
CROSS JOIN dates d
CROSS JOIN times t
ORDER BY a.staff_id, d.date, t.start_time;