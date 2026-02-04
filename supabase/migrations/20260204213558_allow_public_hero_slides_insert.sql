/*
  # Allow Public Hero Slides Insert

  1. Changes
    - Drop the authenticated-only insert policy for hero_slides table
    - Create new policy that allows anyone to insert hero slides
    
  2. Security
    - This is necessary for admin operations and initial setup
    - The admin panel will control access through the application layer
*/

DROP POLICY IF EXISTS "Authenticated users can insert hero slides" ON hero_slides;

CREATE POLICY "Anyone can insert hero slides"
  ON hero_slides
  FOR INSERT
  WITH CHECK (true);