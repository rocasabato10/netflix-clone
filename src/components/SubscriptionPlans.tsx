import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  has_ads: boolean;
  features: string[];
}

interface SubscriptionPlansProps {
  onSelectPlan: (planSlug: string) => void;
  selectedPlan?: string;
  showTitle?: boolean;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  onSelectPlan,
  selectedPlan,
  showTitle = true
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching plans:', error);
      } else {
        setPlans(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">Caricamento piani...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showTitle && (
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Scegli il tuo abbonamento
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onSelectPlan(plan.slug)}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedPlan === plan.slug
                ? 'border-blue-600 bg-blue-50 shadow-lg'
                : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
            }`}
          >
            {selectedPlan === plan.slug && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" />
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-2xl font-bold text-gray-900">{plan.name}</h4>
              <div className="mt-2">
                <span className="text-4xl font-bold text-gray-900">
                  €{plan.price.toFixed(2)}
                </span>
                <span className="text-gray-600 ml-2">/mese</span>
              </div>
            </div>

            <ul className="space-y-3 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {plan.has_ads && (
              <div className="mt-4 text-sm text-orange-600 font-medium">
                Include pubblicità
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
