import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
        <div className="flex items-center px-8 py-4">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span>Torna alla Home</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8">Chi Siamo</h1>

          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p className="text-xl text-white">
              ModaFlicks è la piattaforma di streaming premium dedicata al mondo della moda, dove l'eleganza incontra l'innovazione digitale.
            </p>

            <p>
              Fondata nel 2024, ModaFlicks nasce dalla passione per l'haute couture e dalla visione di rendere accessibile a tutti gli appassionati di moda i contenuti più esclusivi del settore. Dalla passerella ai backstage, dalle interviste ai designer alle sfilate più prestigiose del mondo, offriamo un'esperienza immersiva nel cuore della moda internazionale.
            </p>

            <h2 className="text-3xl font-bold text-white pt-8">La Nostra Missione</h2>
            <p>
              Democratizzare l'accesso ai contenuti di moda di alta qualità, permettendo a designer emergenti e appassionati di connettersi con un pubblico globale. Crediamo che la moda sia arte, espressione e cultura, e merita di essere celebrata attraverso una piattaforma all'altezza della sua eleganza.
            </p>

            <h2 className="text-3xl font-bold text-white pt-8">Cosa Offriamo</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li>Copertura esclusiva delle Fashion Week internazionali</li>
              <li>Documentari e interviste con i più grandi designer del mondo</li>
              <li>Accesso dietro le quinte delle sfilate più prestigiose</li>
              <li>Contenuti educativi su tendenze, stile e storia della moda</li>
              <li>Archivi storici delle collezioni iconiche</li>
            </ul>

            <h2 className="text-3xl font-bold text-white pt-8">Il Nostro Team</h2>
            <p>
              Siamo un team di appassionati di moda, tecnologia e storytelling. I nostri curatori lavorano instancabilmente per selezionare e produrre contenuti che catturino l'essenza della creatività e dell'innovazione nel mondo della moda. Collaboriamo con le più importanti case di moda, fotografi, giornalisti e influencer per portarvi il meglio del panorama fashion internazionale.
            </p>

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mt-12">
              <h2 className="text-2xl font-bold text-white mb-4">Unisciti alla Rivoluzione della Moda Digitale</h2>
              <p className="mb-6">
                Scopri un mondo di eleganza, creatività e ispirazione. Abbonati oggi e accedi a contenuti esclusivi che celebrano l'arte della moda.
              </p>
              <button
                onClick={() => navigate('/home')}
                className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition"
              >
                Scopri i Nostri Piani
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
