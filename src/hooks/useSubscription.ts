import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { UserSubscription, SubscriptionPlan } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;

    try {
      const { data: subData, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (subError) throw subError;

      if (subData) {
        setSubscription(subData);
        setHasActiveSubscription(true);

        const { data: planData, error: planError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', subData.plan_id)
          .single();

        if (planError) throw planError;
        if (planData) setPlan(planData);
      } else {
        setHasActiveSubscription(false);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (planId: string) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      await loadSubscription();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const hasAds = plan?.has_ads ?? true;

  return {
    subscription,
    plan,
    loading,
    hasActiveSubscription,
    hasAds,
    createSubscription,
    refreshSubscription: loadSubscription,
  };
}
