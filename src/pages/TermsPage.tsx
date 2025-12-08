import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function TermsPage() {
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
          <h1 className="text-5xl font-bold mb-4">Termini di Servizio</h1>
          <p className="text-gray-400 mb-12">Ultimo aggiornamento: Dicembre 2024</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Accettazione dei Termini</h2>
              <p>
                Accedendo e utilizzando ModaFlicks, accetti di essere vincolato da questi Termini di Servizio. Se non accetti questi termini, non puoi utilizzare il servizio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Descrizione del Servizio</h2>
              <p>
                ModaFlicks è una piattaforma di streaming video che offre contenuti premium relativi alla moda, inclusi sfilate, documentari, interviste e altro materiale esclusivo. Il servizio è disponibile tramite abbonamento a pagamento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Requisiti dell'Account</h2>
              <h3 className="text-xl font-semibold text-white mb-3">3.1 Registrazione</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Devi avere almeno 18 anni per creare un account</li>
                <li>Devi fornire informazioni accurate e complete</li>
                <li>Sei responsabile della sicurezza del tuo account</li>
                <li>Non puoi condividere le credenziali con altri</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">3.2 Uso dell'Account</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Un account può essere utilizzato su un numero limitato di dispositivi simultaneamente</li>
                <li>È vietato l'uso commerciale dell'account personale</li>
                <li>Ci riserviamo il diritto di sospendere account sospetti</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Abbonamenti e Pagamenti</h2>
              <h3 className="text-xl font-semibold text-white mb-3">4.1 Piani di Abbonamento</h3>
              <p className="mb-3">
                Offriamo diversi piani di abbonamento con caratteristiche e prezzi variabili. I dettagli sono disponibili sulla pagina dei piani.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">4.2 Fatturazione</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Gli abbonamenti sono rinnovati automaticamente</li>
                <li>Accettiamo pagamenti tramite carta di credito e altri metodi specificati</li>
                <li>I prezzi possono variare con preavviso di 30 giorni</li>
                <li>Non offriamo rimborsi per periodi già fatturati</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">4.3 Cancellazione</h3>
              <p>
                Puoi cancellare l'abbonamento in qualsiasi momento. L'accesso continuerà fino alla fine del periodo di fatturazione corrente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Uso Accettabile</h2>
              <p className="mb-3">È vietato:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Scaricare, copiare o ridistribuire contenuti senza autorizzazione</li>
                <li>Utilizzare bot, script o software automatizzati</li>
                <li>Tentare di aggirare misure di sicurezza o DRM</li>
                <li>Caricare malware o contenuti dannosi</li>
                <li>Violare diritti di proprietà intellettuale</li>
                <li>Impersonare altri utenti o entità</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Proprietà Intellettuale</h2>
              <p>
                Tutti i contenuti su ModaFlicks, inclusi video, immagini, testi, loghi e grafica, sono protetti da copyright e altri diritti di proprietà intellettuale. Non acquisisci alcun diritto di proprietà sui contenuti.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitazione di Responsabilità</h2>
              <p className="mb-3">
                ModaFlicks non sarà responsabile per:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Interruzioni del servizio o problemi tecnici</li>
                <li>Perdita di dati o contenuti</li>
                <li>Danni indiretti, incidentali o consequenziali</li>
                <li>Contenuti di terze parti o link esterni</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Modifiche ai Termini</h2>
              <p>
                Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche sostanziali saranno comunicate con almeno 30 giorni di anticipo. L'uso continuato del servizio dopo le modifiche costituisce accettazione.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Risoluzione</h2>
              <p>
                Possiamo sospendere o terminare il tuo account immediatamente in caso di violazione di questi termini, senza preavviso e senza rimborso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Legge Applicabile</h2>
              <p>
                Questi termini sono regolati dalla legge italiana. Qualsiasi controversia sarà soggetta alla giurisdizione esclusiva dei tribunali di Milano, Italia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contatti</h2>
              <p>
                Per domande sui Termini di Servizio, contattaci:
              </p>
              <div className="mt-4 bg-gray-900 rounded-lg p-6">
                <p><strong>Email:</strong> legal@modaflicks.com</p>
                <p><strong>Indirizzo:</strong> Via della Moda 1, 20121 Milano, Italia</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
