/*
  # Add year field to videos and setup designer-based runway

  1. Changes to videos table
    - Add `year` column to store the collection year (e.g., 2024, 2025)
    - Add index on year for faster filtering
  
  2. New Data
    - Add Giorgio Armani and other famous designers
    - Create runway videos for designers with specific years
  
  3. Security
    - No changes to RLS policies needed
*/

-- Add year column to videos table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'year'
  ) THEN
    ALTER TABLE videos ADD COLUMN year INTEGER;
    CREATE INDEX IF NOT EXISTS idx_videos_year ON videos(year);
  END IF;
END $$;

-- Insert Giorgio Armani designer
INSERT INTO designers (name, slug, bio, birth_date, birth_place, photo_url, brands, achievements, signature_style)
VALUES (
  'Giorgio Armani',
  'giorgio-armani',
  'Giorgio Armani è uno dei designer più influenti e rispettati al mondo. Ha fondato il suo impero della moda nel 1975 e ha ridefinito l''eleganza con il suo stile sofisticato e senza tempo. È famoso per le sue giacche destrutturate, i tailleur fluidi e l''uso di tonalità neutre. Ha vestito alcune delle più grandi star del cinema e ha costruito un impero che spazia dall''alta moda al beauty, dall''arredamento agli hotel di lusso.',
  '1934-07-11',
  'Piacenza, Italia',
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["Giorgio Armani", "Armani Privé", "Emporio Armani"]'::jsonb,
  '["Fondatore di Giorgio Armani", "Giacca destrutturata iconica", "Stile Hollywood Regency", "Impero del lusso globale", "Designer italiano più venduto"]'::jsonb,
  'Eleganza minimalista, linee pulite, giacche destrutturate, palette neutre, lusso discreto'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Donatella Versace designer
INSERT INTO designers (name, slug, bio, birth_date, birth_place, photo_url, brands, achievements, signature_style)
VALUES (
  'Donatella Versace',
  'donatella-versace',
  'Donatella Versace è la direttrice creativa di Versace dal 1997, dopo la tragica morte di suo fratello Gianni. Ha mantenuto viva la visione audace e glamour del brand, aggiungendo la sua sensibilità moderna. È conosciuta per i suoi abiti sexy e potenti, l''uso di stampe vivaci, la Medusa, e per aver portato Versace nel XXI secolo mantenendo l''identità distintiva del marchio.',
  '1955-05-02',
  'Reggio Calabria, Italia',
  'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["Versace", "Versus Versace"]'::jsonb,
  '["Direttrice creativa Versace", "Rinascita del brand Versace", "Icona di stile glamour", "Collaborazioni con celebrità", "Innovazione nel lusso italiano"]'::jsonb,
  'Glamour audace, stampe vivaci, sensualità, colori intensi, lusso barocco moderno'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Tom Ford designer
INSERT INTO designers (name, slug, bio, birth_date, birth_place, photo_url, brands, achievements, signature_style)
VALUES (
  'Tom Ford',
  'tom-ford',
  'Tom Ford è un designer, regista e imprenditore americano. Ha salvato Gucci dalla bancarotta negli anni ''90 trasformandolo in uno dei brand più desiderabili al mondo. Nel 2005 ha lanciato il suo marchio Tom Ford, che è diventato sinonimo di lusso sessuale e sofisticazione. È conosciuto per i suoi completi impeccabili, gli abiti sensuali e l''estetica glamour.',
  '1961-08-27',
  'Austin, Texas, USA',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["Tom Ford", "Gucci", "Yves Saint Laurent"]'::jsonb,
  '["Rilancio di Gucci", "Fondatore Tom Ford", "Regista premiato", "Rivoluzione del lusso moderno", "Icona di stile maschile"]'::jsonb,
  'Lusso sessuale, tailoring impeccabile, glamour contemporaneo, sensualità sofisticata'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Virgil Abloh designer
INSERT INTO designers (name, slug, bio, birth_date, birth_place, photo_url, brands, achievements, signature_style)
VALUES (
  'Virgil Abloh',
  'virgil-abloh',
  'Virgil Abloh è stato un designer visionario, DJ e artista. Fondatore del brand streetwear Off-White e direttore artistico maschile di Louis Vuitton dal 2018, ha ridefinito il confine tra streetwear e alta moda. Con il suo approccio multidisciplinare e le sue iconiche virgolette, ha democratizzato la moda di lusso e ispirato una nuova generazione di creativi.',
  '1980-09-30',
  'Rockford, Illinois, USA',
  'https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["Off-White", "Louis Vuitton Men", "Nike collaborations"]'::jsonb,
  '["Fondatore Off-White", "Direttore artistico LV Men", "Fusione streetwear e lusso", "Collaborazioni Nike The Ten", "Innovatore culturale"]'::jsonb,
  'Streetwear di lusso, virgolette iconiche, decostruzione, fusione arte e moda, democratizzazione del lusso'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Alexander McQueen designer
INSERT INTO designers (name, slug, bio, birth_date, birth_place, photo_url, brands, achievements, signature_style)
VALUES (
  'Alexander McQueen',
  'alexander-mcqueen',
  'Lee Alexander McQueen è stato uno dei designer più innovativi e visionari della storia della moda. Le sue sfilate erano spettacoli teatrali che sfidavano le convenzioni, mescolando bellezza e oscurità, artigianalità tradizionale e tecnologia futuristica. Ha lavorato per Givenchy prima di concentrarsi sul suo brand. Il suo genio creativo e la sua abilità sartoriale rimangono leggendari.',
  '1969-03-17',
  'Londra, Regno Unito',
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["Alexander McQueen", "Givenchy"]'::jsonb,
  '["Sfilate teatrali rivoluzionarie", "Artigianalità sartoriale britannica", "Innovazione tecnologica nella moda", "British Designer of the Year 4 volte", "Eredità duratura nella moda"]'::jsonb,
  'Teatro e moda, bellezza oscura, artigianalità suprema, innovazione tecnica, romanticismo gotico'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Valentino Garavani designer
INSERT INTO designers (name, slug, bio, birth_date, birth_place, photo_url, brands, achievements, signature_style)
VALUES (
  'Valentino Garavani',
  'valentino-garavani',
  'Valentino Garavani è una leggenda vivente della moda italiana. Ha fondato la maison Valentino nel 1960 e ha creato alcuni degli abiti più iconici della storia, vestendo first ladies, principesse e star di Hollywood. Il suo iconico "Valentino Red" è diventato sinonimo di eleganza e glamour. Ha definito il lusso romano con le sue creazioni raffinate e romantiche.',
  '1932-05-11',
  'Voghera, Italia',
  'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["Valentino", "RED Valentino"]'::jsonb,
  '["Fondatore Valentino", "Creatore del Valentino Red", "Haute couture iconica", "Vestiti per first ladies e royalty", "Maestro dell''eleganza italiana"]'::jsonb,
  'Rosso Valentino, eleganza romantica, haute couture raffinata, lusso italiano, femminilità sofisticata'
)
ON CONFLICT (slug) DO NOTHING;