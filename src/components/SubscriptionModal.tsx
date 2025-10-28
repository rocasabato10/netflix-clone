import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SubscriptionPlan } from '../lib/supabase';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: (planId: string) => void;
}

export default function SubscriptionModal({ onClose, onSubscribe }: SubscriptionModalProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('active', true)
        .order('price');

      if (error) throw error;
      if (data) setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = () => {
    if (selectedPlan) {
      onSubscribe(selectedPlan);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-5xl w-full mx-4 border border-gray-800">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
        >
          <X size={28} />
        </button>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Scegli il tuo piano
          </h2>
          <p className="text-gray-400 text-lg">
            Seleziona l'abbonamento perfetto per te
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white py-12">Caricamento piani...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {plans.map((plan) => {
              const features = Array.isArray(plan.features) ? plan.features : [];
              const isSelected = selectedPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative cursor-pointer rounded-xl p-8 transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-br from-rose-600 to-pink-600 transform scale-105 shadow-2xl'
                      : 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-white rounded-full p-1">
                        <Check size={20} className="text-rose-600" />
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${isSelected ? 'text-rose-100' : 'text-gray-400'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-white">
                        €{plan.price.toFixed(2)}
                      </span>
                      <span className={`ml-2 ${isSelected ? 'text-rose-100' : 'text-gray-400'}`}>
                        /mese
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check
                          size={20}
                          className={`flex-shrink-0 mt-0.5 ${
                            isSelected ? 'text-white' : 'text-rose-500'
                          }`}
                        />
                        <span className={isSelected ? 'text-white' : 'text-gray-300'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSubscribe}
            disabled={!selectedPlan || loading}
            className="px-12 py-4 bg-rose-600 text-white text-lg font-semibold rounded-lg hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continua con il pagamento
          </button>
        </div>
      </div>
    </div>
  );
}
