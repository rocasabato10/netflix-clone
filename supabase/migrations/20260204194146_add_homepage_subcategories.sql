/*
  # Aggiungi sottocategorie per la Homepage

  1. Nuove sottocategorie
    - New Releases (Nuove uscite) - per i video più recenti
    - Fashion Week - per i contenuti della settimana della moda
    - Keep Watching (Continua a guardare) - per i video in corso
    - Suggested For You (Suggeriti per te) - per i suggerimenti personalizzati
    - Because You Watched (Perché hai guardato) - per i contenuti correlati
  
  2. Descrizione
    Queste sottocategorie permettono di organizzare i contenuti visualizzati
    nella homepage e facilitano il caricamento di video per sezioni specifiche
*/

-- Inserisci le sottocategorie per la homepage
INSERT INTO subcategories (name, slug, category_id)
VALUES 
  ('New Releases', 'new-releases', 'e43f99a5-bd7a-48c2-adfa-66254d08d34f'),
  ('Fashion Week', 'fashion-week-home', 'e43f99a5-bd7a-48c2-adfa-66254d08d34f'),
  ('Keep Watching', 'keep-watching', 'e43f99a5-bd7a-48c2-adfa-66254d08d34f'),
  ('Suggested For You', 'suggested-for-you', 'e43f99a5-bd7a-48c2-adfa-66254d08d34f'),
  ('Because You Watched', 'because-you-watched', 'e43f99a5-bd7a-48c2-adfa-66254d08d34f')
ON CONFLICT (slug) DO NOTHING;