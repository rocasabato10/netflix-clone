import { ArrowLeft, Briefcase, Users, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function CareersPage() {
  const navigate = useNavigate();

  const positions = [
    {
      title: 'Content Curator - Fashion',
      department: 'Contenuti',
      location: 'Milano, Italia',
      type: 'Full-time'
    },
    {
      title: 'Senior Full Stack Developer',
      department: 'Tecnologia',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Fashion Video Editor',
      department: 'Produzione',
      location: 'Milano / Parigi',
      type: 'Full-time'
    },
    {
      title: 'Social Media Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time'
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
          <h1 className="text-5xl font-bold mb-8">Lavora Con Noi</h1>

          <p className="text-xl text-gray-300 mb-12">
            Unisciti al team di ModaFlicks e contribuisci a rivoluzionare il modo in cui il mondo vive la moda.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-gray-900 rounded-xl p-6">
              <Sparkles className="text-white mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Creatività</h3>
              <p className="text-gray-400">
                Lavora in un ambiente che celebra l'innovazione e l'espressione artistica
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <Users className="text-white mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Team Internazionale</h3>
              <p className="text-gray-400">
                Collabora con professionisti da tutto il mondo nel settore moda e tech
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <TrendingUp className="text-white mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Crescita</h3>
              <p className="text-gray-400">
                Opportunità di sviluppo professionale in un'azienda in rapida espansione
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <Briefcase className="text-white mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Flessibilità</h3>
              <p className="text-gray-400">
                Smart working, orari flessibili e benefit competitivi
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8">Posizioni Aperte</h2>
          <div className="space-y-4 mb-12">
            {positions.map((position, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{position.title}</h3>
                  <span className="text-sm bg-white bg-opacity-10 px-3 py-1 rounded-full">
                    {position.type}
                  </span>
                </div>
                <div className="flex gap-4 text-gray-400 text-sm">
                  <span>{position.department}</span>
                  <span>•</span>
                  <span>{position.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Non trovi la posizione giusta?</h2>
            <p className="text-gray-300 mb-6">
              Siamo sempre alla ricerca di talenti eccezionali. Inviaci il tuo CV e raccontaci come potresti contribuire al successo di ModaFlicks.
            </p>
            <a
              href="mailto:careers@modaflicks.com"
              className="inline-block bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition"
            >
              Candidatura Spontanea
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
