/*
  # Add Sample Videos

  1. New Data
    - Add sample videos with thumbnails for each subcategory
    - Each subcategory has at least 3 videos
    - Using fashion-related stock images from Pexels
*/

INSERT INTO videos (subcategory_id, title, description, thumbnail_url, video_url, duration, year, featured)
SELECT s.id, v.title, v.description, v.thumbnail_url, v.video_url, v.duration, v.year, v.featured
FROM subcategories s
CROSS JOIN (VALUES
  ('Movies', 'The Devil Wears Prada', 'A young journalist lands a job as an assistant to one of the city''s most powerful fashion magazine editors', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://storage.example.com/videos/movie1.mp4', 6540, 2006, true),
  ('Movies', 'Coco Before Chanel', 'The story of Coco Chanel''s rise from obscure beginnings to the heights of the fashion world', 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg', 'https://storage.example.com/videos/movie2.mp4', 6600, 2009, false),
  ('Movies', 'Phantom Thread', 'Set in 1950s London, a renowned dressmaker''s carefully tailored life is disrupted by a young woman', 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg', 'https://storage.example.com/videos/movie3.mp4', 7860, 2017, false),
  ('Movies', 'A Single Man', 'An English professor struggles to find meaning in life after the death of his long-term partner', 'https://images.pexels.com/photos/1661535/pexels-photo-1661535.jpeg', 'https://storage.example.com/videos/movie4.mp4', 5940, 2009, false),
  
  ('Documentaries', 'The September Issue', 'A documentary chronicling Vogue editor-in-chief Anna Wintour''s preparations for the 2007 fall fashion issue', 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg', 'https://storage.example.com/videos/doc1.mp4', 5280, 2009, false),
  ('Documentaries', 'Dior and I', 'An exclusive behind-the-scenes look at Raf Simons'' first haute couture collection for Christian Dior', 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg', 'https://storage.example.com/videos/doc2.mp4', 5340, 2014, false),
  ('Documentaries', 'McQueen', 'The life and career of fashion designer Lee Alexander McQueen: from his start as a tailor to becoming a couture icon', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://storage.example.com/videos/doc3.mp4', 6660, 2018, false),
  ('Documentaries', 'The First Monday in May', 'Follows the creation of The Metropolitan Museum of Art''s most attended fashion exhibition in history', 'https://images.pexels.com/photos/1127000/pexels-photo-1127000.jpeg', 'https://storage.example.com/videos/doc4.mp4', 5700, 2016, false),
  
  ('Interviews', 'Conversations with Karl Lagerfeld', 'An intimate conversation with the iconic fashion designer about his creative process and vision', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg', 'https://storage.example.com/videos/int1.mp4', 2400, 2018, false),
  ('Interviews', 'Miuccia Prada: The Art of Fashion', 'The Prada founder discusses the intersection of art, culture, and fashion design', 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg', 'https://storage.example.com/videos/int2.mp4', 2100, 2019, false),
  ('Interviews', 'Virgil Abloh: Creating the New', 'The Off-White founder and Louis Vuitton artistic director shares his design philosophy', 'https://images.pexels.com/photos/1485031/pexels-photo-1485031.jpeg', 'https://storage.example.com/videos/int3.mp4', 2700, 2020, false),
  ('Interviews', 'Alexander McQueen: Rebel Designer', 'Rare interviews revealing the genius behind some of fashion''s most provocative collections', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 'https://storage.example.com/videos/int4.mp4', 3000, 2015, false),
  
  ('Fashion Shows', 'Chanel Spring Summer 2024', 'The iconic French fashion house presents its latest ready-to-wear collection', 'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg', 'https://storage.example.com/videos/show1.mp4', 1200, 2024, true),
  ('Fashion Shows', 'Versace Fall Winter 2024', 'Bold colors and dramatic silhouettes define this stunning collection', 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg', 'https://storage.example.com/videos/show2.mp4', 1380, 2024, false),
  ('Fashion Shows', 'Gucci Cruise Collection 2024', 'A celebration of Italian craftsmanship and modern elegance', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://storage.example.com/videos/show3.mp4', 1560, 2024, false),
  ('Fashion Shows', 'Balenciaga Haute Couture 2024', 'Architectural forms meet haute couture in this groundbreaking show', 'https://images.pexels.com/photos/1936848/pexels-photo-1936848.jpeg', 'https://storage.example.com/videos/show4.mp4', 1440, 2024, false),
  
  ('Fashion Weeks', 'Paris Fashion Week Highlights 2024', 'The best moments from the world''s most prestigious fashion week', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://storage.example.com/videos/fw1.mp4', 3600, 2024, false),
  ('Fashion Weeks', 'Milan Fashion Week 2024', 'Italian excellence on display with shows from Prada, Dolce & Gabbana, and more', 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg', 'https://storage.example.com/videos/fw2.mp4', 3300, 2024, false),
  ('Fashion Weeks', 'New York Fashion Week 2024', 'American designers showcase their vision for the upcoming season', 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg', 'https://storage.example.com/videos/fw3.mp4', 3420, 2024, false),
  ('Fashion Weeks', 'London Fashion Week 2024', 'British creativity and innovation take center stage', 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg', 'https://storage.example.com/videos/fw4.mp4', 3180, 2024, false),
  
  ('Backstages', 'Behind the Scenes: Dior Couture', 'Witness the meticulous preparation before a major haute couture show', 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg', 'https://storage.example.com/videos/back1.mp4', 1800, 2024, false),
  ('Backstages', 'Chanel Show Preparations', 'The organized chaos of getting ready for a Chanel runway show', 'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg', 'https://storage.example.com/videos/back2.mp4', 1620, 2024, false),
  ('Backstages', 'Versace Backstage Access', 'Exclusive look at models, makeup, and last-minute adjustments', 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg', 'https://storage.example.com/videos/back3.mp4', 1740, 2024, false),
  ('Backstages', 'Hermès: The Final Hour', 'The tension and excitement in the hour before showtime', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://storage.example.com/videos/back4.mp4', 1500, 2024, false),
  
  ('Prêt-à-Porter', 'Louis Vuitton Ready-to-Wear 2024', 'Modern luxury meets everyday elegance in this collection', 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg', 'https://storage.example.com/videos/rtw1.mp4', 1440, 2024, false),
  ('Prêt-à-Porter', 'Prada Spring Collection', 'Minimalist sophistication with unexpected details', 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg', 'https://storage.example.com/videos/rtw2.mp4', 1320, 2024, false),
  ('Prêt-à-Porter', 'Saint Laurent Contemporary Chic', 'Rock and roll meets Parisian elegance', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://storage.example.com/videos/rtw3.mp4', 1380, 2024, false),
  ('Prêt-à-Porter', 'Bottega Veneta New Essentials', 'Timeless pieces reimagined for the modern wardrobe', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg', 'https://storage.example.com/videos/rtw4.mp4', 1260, 2024, false),
  
  ('Haute Couture', 'Valentino Haute Couture 2024', 'Romantic and dramatic gowns that push the boundaries of fashion', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://storage.example.com/videos/hc1.mp4', 1620, 2024, false),
  ('Haute Couture', 'Givenchy Couture Masterpieces', 'Architectural precision meets feminine grace', 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg', 'https://storage.example.com/videos/hc2.mp4', 1560, 2024, false),
  ('Haute Couture', 'Dior Haute Couture Dreams', 'The epitome of French savoir-faire and craftsmanship', 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg', 'https://storage.example.com/videos/hc3.mp4', 1680, 2024, false),
  ('Haute Couture', 'Schiaparelli Surrealist Collection', 'Art and fashion collide in these extraordinary designs', 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg', 'https://storage.example.com/videos/hc4.mp4', 1500, 2024, false),
  
  ('Designers', 'Coco Chanel: The Legend', 'The revolutionary designer who changed women''s fashion forever', 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg', 'https://storage.example.com/videos/des1.mp4', 3600, 2020, false),
  ('Designers', 'Yves Saint Laurent: Pioneer', 'The life and legacy of one of fashion''s greatest innovators', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://storage.example.com/videos/des2.mp4', 3900, 2019, false),
  ('Designers', 'Giorgio Armani: Italian Master', 'Six decades of redefining elegance and sophistication', 'https://images.pexels.com/photos/1936848/pexels-photo-1936848.jpeg', 'https://storage.example.com/videos/des3.mp4', 3300, 2021, false),
  ('Designers', 'Vivienne Westwood: Punk Queen', 'The British designer who brought punk to the runway', 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg', 'https://storage.example.com/videos/des4.mp4', 3420, 2018, false),
  
  ('Street Wear', 'Supreme: Street Culture Icon', 'How a skateboard brand became a fashion phenomenon', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 'https://storage.example.com/videos/sw1.mp4', 2400, 2023, false),
  ('Street Wear', 'Off-White: High Fashion Streetwear', 'Virgil Abloh''s vision that changed the fashion landscape', 'https://images.pexels.com/photos/1485031/pexels-photo-1485031.jpeg', 'https://storage.example.com/videos/sw2.mp4', 2700, 2023, false),
  ('Street Wear', 'A Bathing Ape: Tokyo Style', 'The Japanese brand that influenced global street fashion', 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg', 'https://storage.example.com/videos/sw3.mp4', 2280, 2023, false),
  ('Street Wear', 'Stüssy: The Original', 'From California surf culture to worldwide streetwear movement', 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg', 'https://storage.example.com/videos/sw4.mp4', 2160, 2023, false)
) AS v(subcategory_slug, title, description, thumbnail_url, video_url, duration, year, featured)
WHERE s.slug = v.subcategory_slug;
