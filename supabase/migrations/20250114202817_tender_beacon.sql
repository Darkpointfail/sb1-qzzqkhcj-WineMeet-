/*
  # Update profile images for sales representatives

  1. Changes
    - Update image_url for existing sales representatives with different profile images
*/

UPDATE profiles
SET image_url = CASE floor(random() * 8)
  WHEN 0 THEN 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
  WHEN 1 THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
  WHEN 2 THEN 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200'
  WHEN 3 THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
  WHEN 4 THEN 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
  WHEN 5 THEN 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
  WHEN 6 THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200'
  ELSE 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200&h=200'
END
WHERE role = 'sales_rep' AND (image_url IS NULL OR image_url = '');