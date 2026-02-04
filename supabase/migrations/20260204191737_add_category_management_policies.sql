/*
  # Add category and subcategory management policies

  1. Changes
    - Add INSERT policies for authenticated users to create categories
    - Add UPDATE policies for authenticated users to modify categories
    - Add DELETE policies for authenticated users to remove categories
    - Add INSERT policies for authenticated users to create subcategories
    - Add UPDATE policies for authenticated users to modify subcategories
    - Add DELETE policies for authenticated users to remove subcategories

  2. Security
    - All policies require authentication
    - Authenticated users can manage all categories and subcategories
*/

-- Categories: INSERT policy
CREATE POLICY "Authenticated users can create categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Categories: UPDATE policy
CREATE POLICY "Authenticated users can update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Categories: DELETE policy
CREATE POLICY "Authenticated users can delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Subcategories: INSERT policy
CREATE POLICY "Authenticated users can create subcategories"
  ON subcategories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Subcategories: UPDATE policy
CREATE POLICY "Authenticated users can update subcategories"
  ON subcategories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Subcategories: DELETE policy
CREATE POLICY "Authenticated users can delete subcategories"
  ON subcategories
  FOR DELETE
  TO authenticated
  USING (true);
