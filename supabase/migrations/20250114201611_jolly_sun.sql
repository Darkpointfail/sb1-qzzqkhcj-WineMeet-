/*
  # Add more sample meetings

  1. New Data
    - Add two more sample meetings for today
    - Link meetings with products
    - Add detailed meeting information
*/

-- Insert two more meetings for today
WITH sales_reps AS (
  SELECT id FROM profiles WHERE role = 'sales_rep' LIMIT 2
),
new_meetings AS (
  INSERT INTO meetings (id, title, date, sales_rep_id, notes)
  VALUES
    (
      gen_random_uuid(),
      'Premium Bordeaux Showcase',
      CURRENT_DATE + '13:30:00'::time,
      (SELECT id FROM sales_reps LIMIT 1),
      'Exclusive tasting of 2019 vintage Bordeaux wines with focus on market positioning and pricing strategy'
    ),
    (
      gen_random_uuid(),
      'Champagne Holiday Planning',
      CURRENT_DATE + '15:00:00'::time,
      (SELECT id FROM sales_reps OFFSET 1 LIMIT 1),
      'Strategic planning session for upcoming holiday season champagne promotions and staff training requirements'
    )
  RETURNING id
),
relevant_products AS (
  SELECT id 
  FROM products 
  WHERE type IN ('Red Wine', 'Champagne')
  LIMIT 6
)
-- Link new meetings with products
INSERT INTO meeting_products (meeting_id, product_id)
SELECT 
  m.id,
  p.id
FROM new_meetings m
CROSS JOIN (
  SELECT id 
  FROM relevant_products 
  LIMIT 3
) p;