/*
  # Update Categories and Subcategories

  1. Changes
    - Remove old categories and subcategories
    - Add new categories: Fashion Entertainment, Runway & Collections, Design & Style
    - Add new subcategories for each category
    
  2. New Structure
    - Fashion Entertainment: Movies, Documentaries, Interviews
    - Runway & Collections: Fashion Shows, Fashion Weeks, Backstages, Prêt-à-Porter, Haute Couture
    - Design & Style: Designers, Street Wear
*/

DELETE FROM videos;
DELETE FROM subcategories;
DELETE FROM categories;

INSERT INTO categories (name, slug, "order") VALUES
  ('Fashion Entertainment', 'fashion-entertainment', 1),
  ('Runway & Collections', 'runway-collections', 2),
  ('Design & Style', 'design-style', 3);

INSERT INTO subcategories (category_id, name, slug, "order")
SELECT c.id, s.name, s.slug, s.order
FROM categories c
CROSS JOIN (VALUES
  ('Fashion Entertainment', 'Movies', 'movies', 1),
  ('Fashion Entertainment', 'Documentaries', 'documentaries', 2),
  ('Fashion Entertainment', 'Interviews', 'interviews', 3),
  ('Runway & Collections', 'Fashion Shows', 'fashion-shows', 1),
  ('Runway & Collections', 'Fashion Weeks', 'fashion-weeks', 2),
  ('Runway & Collections', 'Backstages', 'backstages', 3),
  ('Runway & Collections', 'Prêt-à-Porter', 'pret-a-porter', 4),
  ('Runway & Collections', 'Haute Couture', 'haute-couture', 5),
  ('Design & Style', 'Designers', 'designers', 1),
  ('Design & Style', 'Street Wear', 'street-wear', 2)
) AS s(category_name, name, slug, "order")
WHERE c.name = s.category_name;
