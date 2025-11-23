/*
  # Update Categories and Subcategories for Navbar

  1. Changes
    - Remove old categories and subcategories
    - Add new category structure:
      * Fashion Entertainment (Movies, Documentaries, Interviews)
      * Runway & Collections (Fashion Shows, Fashion Weeks, Backstages, Prêt-à-Porter, Haute Couture)
      * Design & Style (Designers, Streetwear)

  2. Notes
    - Existing videos will have their category references set to NULL
    - Clean slate for new category structure
*/

-- Delete existing subcategories and categories
DELETE FROM subcategories;
DELETE FROM categories;

-- Insert new main categories
INSERT INTO categories (name, slug) VALUES
  ('Fashion Entertainment', 'fashion-entertainment'),
  ('Runway & Collections', 'runway-collections'),
  ('Design & Style', 'design-style');

-- Insert subcategories for Fashion Entertainment
INSERT INTO subcategories (name, slug, category_id)
SELECT 'Movies', 'movies', id FROM categories WHERE slug = 'fashion-entertainment';

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Documentaries', 'documentaries', id FROM categories WHERE slug = 'fashion-entertainment';

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Interviews', 'interviews', id FROM categories WHERE slug = 'fashion-entertainment';

-- Insert subcategories for Runway & Collections
INSERT INTO subcategories (name, slug, category_id)
SELECT 'Fashion Shows', 'fashion-shows', id FROM categories WHERE slug = 'runway-collections';

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Fashion Weeks', 'fashion-weeks', id FROM categories WHERE slug = 'runway-collections';

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Backstages', 'backstages', id FROM categories WHERE slug = 'runway-collections';

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Prêt-à-Porter', 'pret-a-porter', id FROM categories WHERE slug = 'runway-collections';

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Haute Couture', 'haute-couture', id FROM categories WHERE slug = 'runway-collections';

-- Insert subcategories for Design & Style
INSERT INTO subcategories (name, slug, category_id)
SELECT 'Designers', 'designers', id FROM categories WHERE slug = 'design-style';

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Streetwear', 'streetwear', id FROM categories WHERE slug = 'design-style';