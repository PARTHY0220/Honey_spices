/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userObj) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userObj.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error.message);
        return null;
      }
      
      if (data) return data;

      // Self-heal: If profile doesn't exist, create it from auth metadata
      const meta = userObj.user_metadata || {};
      const newProfile = {
        id: userObj.id,
        full_name: meta.full_name || meta.name || 'Valued Customer',
        email: userObj.email,
        phone: meta.phone || '',
        role: userObj.email === 'admin@honeyspices.com' ? 'admin' : 'customer'
      };

      const { data: upsertData, error: upsertError } = await supabase
        .from('profiles')
        .upsert([newProfile], { onConflict: 'id' })
        .select()
        .single();

      if (upsertError) {
        console.warn('Could not save self-healed profile to DB:', upsertError);
        return newProfile; // Return in-memory profile so UI doesn't break
      }
      return upsertData;
    } catch (err) {
      console.error('Exception fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Check active session on mount
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          setUser(session.user);
          const prof = await fetchProfile(session.user);
          if (prof && isMounted) {
            setProfile(prof);
          }
        }
      } catch (err) {
        console.error('Error initializing session:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (session) {
        setUser(session.user);
        const prof = await fetchProfile(session.user);
        setProfile(prof);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, fullName, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });
    if (error) throw error;
    
    // Explicitly create the profile as a fallback in case the Supabase trigger is missing
    if (data?.user) {
      const { error: profileError } = await supabase.from('profiles').upsert([
        {
          id: data.user.id,
          full_name: fullName || 'Valued Customer',
          email: email,
          phone: phone || '',
          role: email === 'admin@honeyspices.com' ? 'admin' : 'customer'
        }
      ], { onConflict: 'id' });
      
      if (profileError) {
        console.warn('Manual profile creation warning (trigger may have already handled it):', profileError);
      }
    }
    
    return data;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out warning:', err.message);
    }
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const prof = await fetchProfile(user);
      if (prof) setProfile(prof);
    }
  };


  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
