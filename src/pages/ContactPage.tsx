import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Footer from '../components/Footer';

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Messaggio inviato con successo! Ti risponderemo presto.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-8">Contattaci</h1>

          <p className="text-xl text-gray-300 mb-12">
            Hai domande o suggerimenti? Siamo qui per ascoltarti.
          </p>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition"
                    placeholder="Il tuo nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition"
                    placeholder="la-tua-email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Oggetto</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition"
                    placeholder="Di cosa vuoi parlare?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Messaggio</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition resize-none"
                    placeholder="Scrivi il tuo messaggio..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Invia Messaggio
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Email</h3>
                    <p className="text-gray-400">info@modaflicks.com</p>
                    <p className="text-gray-400">support@modaflicks.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Telefono</h3>
                    <p className="text-gray-400">+39 02 1234 5678</p>
                    <p className="text-sm text-gray-500 mt-1">Lun-Ven: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Sede</h3>
                    <p className="text-gray-400">
                      Via della Moda 1<br />
                      20121 Milano<br />
                      Italia
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Orari di Supporto</h3>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Lunedì - Venerdì:</strong> 9:00 - 18:00</p>
                  <p><strong>Sabato:</strong> 10:00 - 14:00</p>
                  <p><strong>Domenica:</strong> Chiuso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
