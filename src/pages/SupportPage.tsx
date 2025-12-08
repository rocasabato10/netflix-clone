import { ArrowLeft, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function SupportPage() {
  const navigate = useNavigate();

  const topics = [
    {
      title: 'Account e Abbonamenti',
      items: [
        'Come creare un account',
        'Come modificare il piano di abbonamento',
        'Come cancellare l\'abbonamento',
        'Problemi di fatturazione',
        'Recupero password'
      ]
    },
    {
      title: 'Contenuti e Riproduzione',
      items: [
        'Problemi di buffering o caricamento',
        'Qualità video bassa',
        'Errori durante la riproduzione',
        'Contenuti non disponibili',
        'Sottotitoli e audio'
      ]
    },
    {
      title: 'Dispositivi e Compatibilità',
      items: [
        'Dispositivi supportati',
        'App mobile non funziona',
        'Problemi di login su Smart TV',
        'Limitazioni geografiche',
        'Numero massimo di dispositivi'
      ]
    }
  ];

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
          <h1 className="text-5xl font-bold mb-8">Centro Assistenza</h1>

          <p className="text-xl text-gray-300 mb-12">
            Siamo qui per aiutarti. Trova risposte alle domande più frequenti o contatta il nostro team di supporto.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition cursor-pointer">
              <HelpCircle className="mx-auto mb-4" size={48} />
              <h3 className="text-lg font-bold mb-2">FAQ</h3>
              <p className="text-gray-400 text-sm">
                Risposte rapide alle domande più comuni
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition cursor-pointer">
              <Mail className="mx-auto mb-4" size={48} />
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-gray-400 text-sm">
                Risposta entro 24 ore
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition cursor-pointer">
              <MessageCircle className="mx-auto mb-4" size={48} />
              <h3 className="text-lg font-bold mb-2">Chat Live</h3>
              <p className="text-gray-400 text-sm">
                Lun-Ven 9:00-18:00
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8">Argomenti Popolari</h2>
          <div className="space-y-6 mb-12">
            {topics.map((topic, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">{topic.title}</h3>
                <ul className="space-y-3">
                  {topic.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <button className="text-gray-400 hover:text-white transition text-left">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Hai ancora bisogno di aiuto?</h2>
            <p className="text-gray-300 mb-6">
              Il nostro team di supporto è disponibile per assisterti con qualsiasi problema o domanda.
            </p>
            <a
              href="mailto:support@modaflicks.com"
              className="inline-block bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition"
            >
              Contatta il Supporto
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
