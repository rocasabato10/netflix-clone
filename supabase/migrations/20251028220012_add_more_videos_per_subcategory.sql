/*
  # Add More Videos to Each Subcategory

  1. Data Population
    - Adds 6 additional videos to each existing subcategory
    - Each subcategory will have at least 10 videos total
    - Videos include realistic fashion-related content with proper metadata
    
  2. Content Details
    - High-quality Pexels stock photos for thumbnails
    - Variety of durations (60-180 seconds)
    - Years ranging from 2022-2024
    - Descriptive titles and descriptions for fashion content
*/

-- Add more videos to Designers subcategory
INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id) VALUES
('Emerging Designers Showcase 2024', 'Fresh talents presenting their breakthrough collections', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://example.com/video', 95, 2024, '502c561a-0200-4788-9670-4c60cbebc969'),
('Italian Fashion Masters', 'Legacy and innovation from Italian design houses', 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg', 'https://example.com/video', 110, 2023, '502c561a-0200-4788-9670-4c60cbebc969'),
('Sustainable Fashion Pioneers', 'Designers leading the eco-friendly fashion revolution', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', 'https://example.com/video', 88, 2024, '502c561a-0200-4788-9670-4c60cbebc969'),
('The New Minimalists', 'Clean lines and essential design philosophy', 'https://images.pexels.com/photos/1545590/pexels-photo-1545590.jpeg', 'https://example.com/video', 75, 2023, '502c561a-0200-4788-9670-4c60cbebc969'),
('Avant-Garde Visionaries', 'Pushing boundaries in contemporary fashion', 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg', 'https://example.com/video', 105, 2024, '502c561a-0200-4788-9670-4c60cbebc969'),
('Designer Collaborations 2024', 'Unexpected partnerships creating unique pieces', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://example.com/video', 92, 2024, '502c561a-0200-4788-9670-4c60cbebc969');

-- Add more videos to Street Wear subcategory
INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id) VALUES
('Urban Fashion Trends 2024', 'Latest street style movements from global cities', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 'https://example.com/video', 85, 2024, '2cf3e0e0-8325-42ba-b097-976b4ec8dfd1'),
('Sneaker Culture Evolution', 'From basketball courts to fashion statements', 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg', 'https://example.com/video', 78, 2023, '2cf3e0e0-8325-42ba-b097-976b4ec8dfd1'),
('Tokyo Street Fashion', 'Harajuku and beyond - Japanese street style', 'https://images.pexels.com/photos/1759622/pexels-photo-1759622.jpeg', 'https://example.com/video', 95, 2024, '2cf3e0e0-8325-42ba-b097-976b4ec8dfd1'),
('Skateboard Style Icons', 'How skate culture shaped modern streetwear', 'https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg', 'https://example.com/video', 82, 2023, '2cf3e0e0-8325-42ba-b097-976b4ec8dfd1'),
('Hip-Hop Fashion Legacy', 'Music and fashion intersecting on the streets', 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg', 'https://example.com/video', 100, 2024, '2cf3e0e0-8325-42ba-b097-976b4ec8dfd1'),
('Vintage Streetwear Revival', 'Classic pieces making a comeback', 'https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg', 'https://example.com/video', 88, 2023, '2cf3e0e0-8325-42ba-b097-976b4ec8dfd1');

-- Add more videos to Documentaries subcategory
INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id) VALUES
('The Business of Fashion', 'Inside the global fashion industry economics', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://example.com/video', 145, 2023, 'e2776af0-7ff4-4585-9211-64cb3c8860b9'),
('Fast Fashion Impact', 'Environmental and social consequences unveiled', 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg', 'https://example.com/video', 130, 2024, 'e2776af0-7ff4-4585-9211-64cb3c8860b9'),
('Textile Traditions', 'Ancient crafts in modern fashion', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', 'https://example.com/video', 120, 2023, 'e2776af0-7ff4-4585-9211-64cb3c8860b9'),
('Fashion Photography Masters', 'Artists who defined fashion imagery', 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg', 'https://example.com/video', 110, 2024, 'e2776af0-7ff4-4585-9211-64cb3c8860b9'),
('The Supermodel Era', 'When models became global icons', 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg', 'https://example.com/video', 125, 2023, 'e2776af0-7ff4-4585-9211-64cb3c8860b9'),
('Luxury Brand Stories', 'Heritage and evolution of iconic houses', 'https://images.pexels.com/photos/1545590/pexels-photo-1545590.jpeg', 'https://example.com/video', 140, 2024, 'e2776af0-7ff4-4585-9211-64cb3c8860b9');

-- Add more videos to Interviews subcategory
INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id) VALUES
('Design Process Revealed', 'Creative directors share their methodology', 'https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg', 'https://example.com/video', 65, 2024, '7ef0dde2-00fc-40f8-b41a-dfdd5c65e77d'),
('Model Life Stories', 'Behind the glamour with top models', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 'https://example.com/video', 72, 2023, '7ef0dde2-00fc-40f8-b41a-dfdd5c65e77d'),
('Fashion Editor Insights', 'Magazine editors on trend forecasting', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://example.com/video', 68, 2024, '7ef0dde2-00fc-40f8-b41a-dfdd5c65e77d'),
('Stylist Secrets', 'Personal stylists reveal their tricks', 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg', 'https://example.com/video', 60, 2023, '7ef0dde2-00fc-40f8-b41a-dfdd5c65e77d'),
('Photographer Perspectives', 'Fashion photographers on their craft', 'https://images.pexels.com/photos/1759622/pexels-photo-1759622.jpeg', 'https://example.com/video', 75, 2024, '7ef0dde2-00fc-40f8-b41a-dfdd5c65e77d'),
('Influencer Evolution', 'Digital creators changing the industry', 'https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg', 'https://example.com/video', 70, 2024, '7ef0dde2-00fc-40f8-b41a-dfdd5c65e77d');

-- Add more videos to Movies subcategory
INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id) VALUES
('The Designer', 'A young designers journey to Paris Fashion Week', 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg', 'https://example.com/video', 180, 2023, 'eb37c0ba-d23e-4f8b-90ed-16da29bd7b67'),
('Runway Dreams', 'Behind the scenes of an aspiring models life', 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg', 'https://example.com/video', 165, 2024, 'eb37c0ba-d23e-4f8b-90ed-16da29bd7b67'),
('Fashion House', 'Drama and intrigue in haute couture', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', 'https://example.com/video', 175, 2023, 'eb37c0ba-d23e-4f8b-90ed-16da29bd7b67'),
('The Collection', 'Race against time to complete a debut line', 'https://images.pexels.com/photos/1545590/pexels-photo-1545590.jpeg', 'https://example.com/video', 155, 2024, 'eb37c0ba-d23e-4f8b-90ed-16da29bd7b67'),
('Style Revolution', 'A boutique owner fights fast fashion', 'https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg', 'https://example.com/video', 170, 2023, 'eb37c0ba-d23e-4f8b-90ed-16da29bd7b67'),
('The Last Stitch', 'Master tailor passes down ancient techniques', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://example.com/video', 160, 2024, 'eb37c0ba-d23e-4f8b-90ed-16da29bd7b67');

-- Add more videos to Backstages subcategory
INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id) VALUES
('Chaos Behind Beauty', 'Real moments before models hit the runway', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 'https://example.com/video', 70, 2024, 'e0616be5-1e44-44e7-a8e8-694fa905c674'),
('Hair and Makeup Magic', 'Beauty teams creating show looks', 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg', 'https://example.com/video', 65, 2023, 'e0616be5-1e44-44e7-a8e8-694fa905c674'),
('Dressing Room Diaries', 'Models preparing for the catwalk', 'https://images.pexels.com/photos/1759622/pexels-photo-1759622.jpeg', 'https://example.com/video', 68, 2024, 'e0616be5-1e44-44e7-a8e8-694fa905c674'),
('Final Fittings', 'Last-minute adjustments before showtime', 'https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg', 'https://example.com/video', 72, 2023, 'e0616be5-1e44-44e7-a8e8-694fa905c674'),
('Producer Pressure', 'Coordinating the perfect fashion show', 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg', 'https://example.com/video', 75, 2024, 'e0616be5-1e44-44e7-a8e8-694fa905c674'),
('Photographers Backstage', 'Capturing behind-the-scenes moments', 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg', 'https://example.com/video', 60, 2024, 'e0616be5-1e44-44e7-a8e8-694fa905c674');

-- Add more videos to Fashion Shows subcategory
INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id) VALUES
('Chanel Spring/Summer 2024', 'Complete runway show from Paris', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', 'https://example.com/video', 115, 2024, '08a53ad0-8e10-4900-ad81-1e69283580b1'),
('Dior Fall/Winter 2024', 'Latest haute couture collection unveiled', 'https://images.pexels.com/photos/1545590/pexels-photo-1545590.jpeg', 'https://example.com/video', 120, 2024, '08a53ad0-8e10-4900-ad81-1e69283580b1'),
('Gucci Cruise Collection', 'Exotic location fashion spectacular', 'https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg', 'https://example.com/video', 110, 2023, '08a53ad0-8e10-4900-ad81-1e69283580b1'),
('Prada Resort 2024', 'Modern elegance on the runway', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://example.com/video', 105, 2024, '08a53ad0-8e10-4900-ad81-1e69283580b1'),
('Versace Menswear Show', 'Bold statements in mens fashion', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 'https://example.com/video', 100, 2023, '08a53ad0-8e10-4900-ad81-1e69283580b1'),
('Balenciaga Show 2024', 'Provocative designs make headlines', 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg', 'https://example.com/video', 108, 2024, '08a53ad0-8e10-4900-ad81-1e69283580b1');

-- Add more videos to Fashion Weeks subcategory
INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id) VALUES
('Milan Fashion Week Highlights', 'Best moments from Italian fashion capital', 'https://images.pexels.com/photos/1759622/pexels-photo-1759622.jpeg', 'https://example.com/video', 135, 2024, '1d476742-34ed-40bc-a38c-6909f290ec5b'),
('London Fashion Week 2024', 'British creativity on full display', 'https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg', 'https://example.com/video', 125, 2024, '1d476742-34ed-40bc-a38c-6909f290ec5b'),
('New York Fashion Week', 'American designers showcase their vision', 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg', 'https://example.com/video', 140, 2024, '1d476742-34ed-40bc-a38c-6909f290ec5b'),
('Tokyo Fashion Week', 'Innovative Japanese design philosophy', 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg', 'https://example.com/video', 130, 2023, '1d476742-34ed-40bc-a38c-6909f290ec5b'),
('Paris Fashion Week Summary', 'Complete coverage of the ultimate fashion event', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', 'https://example.com/video', 150, 2024, '1d476742-34ed-40bc-a38c-6909f290ec5b'),
('Seoul Fashion Week 2024', 'K-fashion takes center stage', 'https://images.pexels.com/photos/1545590/pexels-photo-1545590.jpeg', 'https://example.com/video', 128, 2024, '1d476742-34ed-40bc-a38c-6909f290ec5b');

-- Add more videos to Haute Couture subcategory
INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id) VALUES
('Couture Craftsmanship', 'Hand-sewn perfection in every detail', 'https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg', 'https://example.com/video', 95, 2024, '487dd588-ab45-4552-9bcd-89aabcaba0a7'),
('Atelier Secrets', 'Inside the couture workshops', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://example.com/video', 88, 2023, '487dd588-ab45-4552-9bcd-89aabcaba0a7'),
('Royal Wedding Fashion', 'Couture for the most special occasions', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', 'https://example.com/video', 105, 2024, '487dd588-ab45-4552-9bcd-89aabcaba0a7'),
('Embroidery Masters', 'Ancient techniques creating modern luxury', 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg', 'https://example.com/video', 92, 2023, '487dd588-ab45-4552-9bcd-89aabcaba0a7'),
('Couture Gala Evening', 'Red carpet spectacular moments', 'https://images.pexels.com/photos/1759622/pexels-photo-1759622.jpeg', 'https://example.com/video', 100, 2024, '487dd588-ab45-4552-9bcd-89aabcaba0a7'),
('Bespoke Bridal Collection', 'Custom wedding gowns creation process', 'https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg', 'https://example.com/video', 98, 2024, '487dd588-ab45-4552-9bcd-89aabcaba0a7');

-- Add more videos to Prêt-à-Porter subcategory
INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id) VALUES
('Ready-to-Wear Revolution', 'How RTW changed fashion forever', 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg', 'https://example.com/video', 85, 2023, 'fabf8d90-8821-4cf6-9def-299fa59c461b'),
('Contemporary Collections', 'Modern elegance for everyday luxury', 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg', 'https://example.com/video', 90, 2024, 'fabf8d90-8821-4cf6-9def-299fa59c461b'),
('Accessible Luxury Brands', 'High fashion meets wearability', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', 'https://example.com/video', 82, 2023, 'fabf8d90-8821-4cf6-9def-299fa59c461b'),
('Capsule Wardrobe Essentials', 'Building a versatile fashion collection', 'https://images.pexels.com/photos/1545590/pexels-photo-1545590.jpeg', 'https://example.com/video', 78, 2024, 'fabf8d90-8821-4cf6-9def-299fa59c461b'),
('Seasonal Must-Haves', 'Key pieces for every wardrobe', 'https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg', 'https://example.com/video', 75, 2023, 'fabf8d90-8821-4cf6-9def-299fa59c461b'),
('Designer Diffusion Lines', 'Premium brands for wider audiences', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://example.com/video', 88, 2024, 'fabf8d90-8821-4cf6-9def-299fa59c461b');
