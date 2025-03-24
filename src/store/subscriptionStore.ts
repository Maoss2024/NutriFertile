import { create } from 'zustand';
import { Subscription } from '../types/database';
import { supabase } from '../lib/supabase';

interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
  hasPremiumAccess: boolean;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  loading: false,
  error: null,
  hasPremiumAccess: false,
  fetchSubscription: async () => {
    set({ loading: true, error: null });
    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const hasPremium = subscription?.is_premium && 
        (!subscription?.expires_at || new Date(subscription.expires_at) > new Date());

      set({ 
        subscription: subscription as Subscription,
        hasPremiumAccess: hasPremium
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));