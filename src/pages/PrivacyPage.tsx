import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function PrivacyPage() {
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
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400 mb-12">Ultimo aggiornamento: Dicembre 2024</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduzione</h2>
              <p>
                ModaFlicks ("noi", "nostro" o "ci") si impegna a proteggere la privacy dei propri utenti. Questa Privacy Policy descrive come raccogliamo, utilizziamo, divulghiamo e proteggiamo le informazioni personali degli utenti della nostra piattaforma di streaming.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Informazioni che Raccogliamo</h2>
              <h3 className="text-xl font-semibold text-white mb-3">2.1 Informazioni fornite direttamente</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Nome, email e password durante la registrazione</li>
                <li>Informazioni di pagamento per gli abbonamenti</li>
                <li>Preferenze e impostazioni del profilo</li>
                <li>Comunicazioni con il nostro servizio clienti</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">2.2 Informazioni raccolte automaticamente</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cronologia di visualizzazione e preferenze di contenuto</li>
                <li>Dati del dispositivo e informazioni tecniche</li>
                <li>Indirizzo IP e geolocalizzazione approssimativa</li>
                <li>Cookie e tecnologie simili</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Come Utilizziamo le Informazioni</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornire e migliorare i nostri servizi</li>
                <li>Personalizzare i contenuti e le raccomandazioni</li>
                <li>Processare pagamenti e gestire abbonamenti</li>
                <li>Comunicare aggiornamenti e novità</li>
                <li>Garantire la sicurezza della piattaforma</li>
                <li>Analizzare l'utilizzo del servizio per miglioramenti</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Condivisione delle Informazioni</h2>
              <p className="mb-3">
                Non vendiamo le informazioni personali degli utenti. Possiamo condividere informazioni con:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provider di servizi terzi che ci assistono nelle operazioni</li>
                <li>Partner commerciali per funzionalità specifiche</li>
                <li>Autorità legali quando richiesto dalla legge</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Sicurezza dei Dati</h2>
              <p>
                Implementiamo misure di sicurezza tecniche e organizzative appropriate per proteggere i dati personali da accesso non autorizzato, alterazione, divulgazione o distruzione. Utilizziamo crittografia SSL/TLS per tutte le trasmissioni di dati sensibili.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. I Tuoi Diritti</h2>
              <p className="mb-3">In conformità con il GDPR, hai diritto a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Accedere ai tuoi dati personali</li>
                <li>Rettificare dati inesatti</li>
                <li>Richiedere la cancellazione dei tuoi dati</li>
                <li>Opporti al trattamento dei tuoi dati</li>
                <li>Richiedere la portabilità dei dati</li>
                <li>Revocare il consenso in qualsiasi momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Cookie</h2>
              <p>
                Utilizziamo cookie e tecnologie simili per migliorare l'esperienza utente, analizzare le prestazioni e personalizzare i contenuti. Puoi gestire le preferenze sui cookie nelle impostazioni del browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Conservazione dei Dati</h2>
              <p>
                Conserviamo i dati personali per il tempo necessario a fornire i servizi e per adempiere agli obblighi legali. I dati degli account cancellati vengono eliminati entro 90 giorni, salvo obblighi di conservazione legali.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Modifiche alla Privacy Policy</h2>
              <p>
                Potremmo aggiornare questa Privacy Policy periodicamente. Le modifiche sostanziali saranno comunicate tramite email o notifica sulla piattaforma. L'uso continuato del servizio dopo le modifiche costituisce accettazione della nuova policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Contatti</h2>
              <p>
                Per domande sulla privacy o per esercitare i tuoi diritti, contattaci:
              </p>
              <div className="mt-4 bg-gray-900 rounded-lg p-6">
                <p><strong>Email:</strong> privacy@modaflicks.com</p>
                <p><strong>Indirizzo:</strong> Via della Moda 1, 20121 Milano, Italia</p>
                <p><strong>Data Protection Officer:</strong> dpo@modaflicks.com</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
