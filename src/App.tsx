import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useSubscription } from './hooks/useSubscription';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, createSubscription, loading: subLoading } = useSubscription();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!subLoading && user && !hasActiveSubscription) {
      setShowSubscriptionModal(true);
    }
  }, [subLoading, user, hasActiveSubscription]);

  const handleSubscribe = async (planId: string) => {
    const { error } = await createSubscription(planId);
    if (!error) {
      setShowSubscriptionModal(false);
    } else {
      alert('Errore durante la creazione dell\'abbonamento');
    }
  };

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading ModaFlix...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-black">
        {showSubscriptionModal && (
          <SubscriptionModal
            onClose={() => setShowSubscriptionModal(false)}
            onSubscribe={handleSubscribe}
          />
        )}
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-panel" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
