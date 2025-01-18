/*
  # Add sample meetings data

  1. New Data
    - Add sample meetings for testing
    - Link meetings with existing sales reps and products
    - Add realistic meeting titles and notes
  
  2. Changes
    - Insert meetings for the current week
    - Associate meetings with existing sales reps
*/

-- Insert sample meetings for the current week
WITH sales_reps AS (
  SELECT id FROM profiles WHERE role = 'sales_rep' LIMIT 5
),
products AS (
  SELECT id FROM products LIMIT 10
)
INSERT INTO meetings (id, title, date, sales_rep_id, notes)
SELECT
  gen_random_uuid(),
  CASE floor(random() * 5)
    WHEN 0 THEN 'Wine Portfolio Review'
    WHEN 1 THEN 'New Vintage Tasting'
    WHEN 2 THEN 'Regional Showcase'
    WHEN 3 THEN 'Seasonal Selection Planning'
    ELSE 'Product Training Session'
  END,
  -- Generate meetings for the current week at different times
  CURRENT_DATE + (n || ' days')::interval + 
  (CASE floor(random() * 4)
    WHEN 0 THEN '10:00:00'
    WHEN 1 THEN '11:30:00'
    WHEN 2 THEN '14:00:00'
    ELSE '15:30:00'
  END)::time,
  (SELECT id FROM sales_reps ORDER BY random() LIMIT 1),
  CASE floor(random() * 5)
    WHEN 0 THEN 'Discussing upcoming releases and market trends'
    WHEN 1 THEN 'Review of customer feedback and sales performance'
    WHEN 2 THEN 'Planning promotional activities for next quarter'
    WHEN 3 THEN 'Staff training on new wine selections'
    ELSE 'Seasonal portfolio adjustments and inventory planning'
  END
FROM generate_series(0, 6) n;

-- Link meetings with products
WITH new_meetings AS (
  SELECT id FROM meetings WHERE created_at > NOW() - interval '1 minute'
),
products AS (
  SELECT id FROM products LIMIT 10
)
INSERT INTO meeting_products (meeting_id, product_id)
SELECT 
  m.id,
  p.id
FROM new_meetings m
CROSS JOIN LATERAL (
  SELECT id FROM products 
  ORDER BY random() 
  LIMIT floor(random() * 3) + 1
) p;