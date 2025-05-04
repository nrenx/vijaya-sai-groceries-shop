import { supabase } from '@/lib/supabase';

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }

    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * Get current session with timeout
   */
  async getSession() {
    try {
      // Create a promise that times out after 5 seconds
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Session request timed out after 5 seconds'));
        }, 5000);
      });

      // Fetch session from Supabase with timeout
      const sessionPromise = supabase.auth.getSession();

      // Race the fetch against the timeout
      const { data, error } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('Error getting session:', error);
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        console.log('Error details:', error.details);
        throw error;
      }

      return data.session;
    } catch (err) {
      console.error('Exception in getSession:', err);
      if (err instanceof Error) {
        console.log('Error name:', err.name);
        console.log('Error message:', err.message);
        console.log('Error stack:', err.stack);
      }
      throw err;
    }
  },

  /**
   * Get current user with timeout
   */
  async getUser() {
    try {
      // Create a promise that times out after 5 seconds
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('User request timed out after 5 seconds'));
        }, 5000);
      });

      // Fetch user from Supabase with timeout
      const userPromise = supabase.auth.getUser();

      // Race the fetch against the timeout
      const { data, error } = await Promise.race([
        userPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('Error getting user:', error);
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        console.log('Error details:', error.details);
        throw error;
      }

      return data.user;
    } catch (err) {
      console.error('Exception in getUser:', err);
      if (err instanceof Error) {
        console.log('Error name:', err.name);
        console.log('Error message:', err.message);
        console.log('Error stack:', err.stack);
      }
      throw err;
    }
  }
};
