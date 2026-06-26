import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing. Please add them to your .env file.'
  );
}

// Fallback proxy to prevent startup crashes when keys are missing.
// It logs warnings when methods are accessed but allows the app to render.
const makeFallbackClient = () => {
  const handler = {
    get(target, prop) {
      if (prop === 'then') {
        return (resolve) => resolve({ data: null, error: new Error('Supabase is not configured') });
      }
      if (typeof prop === 'string') {
        if (prop === 'auth') {
          return {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            signInWithPassword: () => Promise.resolve({ data: {}, error: new Error('Supabase is not configured') }),
            signUp: () => Promise.resolve({ data: {}, error: new Error('Supabase is not configured') }),
            signOut: () => Promise.resolve({ error: null })
          };
        }
        const fn = () => {
          return new Proxy(() => {}, handler);
        };
        return new Proxy(fn, handler);
      }
      return target[prop];
    }
  };
  return new Proxy(() => {}, handler);
};

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : makeFallbackClient();
