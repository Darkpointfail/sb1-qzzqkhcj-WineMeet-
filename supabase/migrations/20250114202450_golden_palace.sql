/*
  # Update profile images for sales representatives

  1. Changes
    - Update image_url for existing sales representatives with different profile images
*/

UPDATE profiles
SET image_url = CASE id
  -- First group (original sales reps)
  WHEN 'f1e2d3c4-b5a6-4c3b-9d8e-7f6a5b4c3d2e' THEN 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
  WHEN 'e2d3c4b5-a6f7-4d3c-8e9f-6a5b4c3d2e1f' THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
  WHEN 'd3c4b5a6-f7e8-4e3d-9f0a-5b4c3d2e1f0a' THEN 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200'
  WHEN 'c4b5a6d7-e8f9-4f3e-0a1b-4c3d2e1f0a9b' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
  -- Additional profile images for other sales reps
  ELSE CASE floor(random() * 6)
    WHEN 0 THEN 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200&h=200'
    WHEN 4 THEN 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200'
    ELSE 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200'
  END
END
WHERE role = 'sales_rep';