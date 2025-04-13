import { create } from 'zustand';
import { toast } from 'sonner';
import { supabase, reinitializeSupabase } from './supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
  // Auth state
  session: Session | null;
  // Auth actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  session: null,
  
  initialize: () => {
    // Only set initial loading state synchronously.
    // The actual session check is now handled by the onAuthStateChange listener in AppProvider.
    set({ isLoading: true, error: null }); 
    console.log('AuthStore: Synchronous initialization set isLoading=true.');
  },

  signUp: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Sign in error:', error);
        set({ error });
      } else if (data.user) {
        console.log('Sign in successful:', data.user.email);
        set({ user: data.user, session: data.session });
      }
      return { error };
    } catch (error) {
      set({ error: error as AuthError });
      return { error: error as AuthError };
    }
  },

  signIn: async (email, password) => {
    console.log('Attempting to sign in with:', email);
    try {
      // Make sure we have the latest Supabase configuration
      // Client should be initialized by AppProvider, no need to reinitialize here
      
      console.log('Calling supabase.auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error.message);
        set({ error });
        return { error };
      }
      
      if (data.user) {
        console.log('Sign in successful for:', data.user.email);
        set({ user: data.user, session: data.session, error: null });
      } else {
        console.warn('Sign in returned no error but also no user');
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      const authError = error as AuthError;
      set({ error: authError });
      return { error: authError };
    }
  },

  signOut: async () => {
    console.log('Signing out user:', get().user?.email);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error(`Error signing out: ${error.message}`);
      } else {
        set({ user: null, session: null });
        console.log('User signed out successfully');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      toast.error(`Unexpected error during sign out`);
    }
  },

  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) set({ error });
      return { error };
    } catch (error) {
      set({ error: error as AuthError });
      return { error: error as AuthError };
    }
  },

  updatePassword: async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) set({ error });
      return { error };
    } catch (error) {
      set({ error: error as AuthError });
      return { error: error as AuthError };
    }
  },
}));

// Note: We no longer initialize auth state here as it's now handled by the initialize method
// that gets called in the AppProvider. This ensures proper sequencing of initialization.
// 
// The Auth state listener is also set up in the AppProvider to ensure it happens
// after Supabase client initialization is complete.
