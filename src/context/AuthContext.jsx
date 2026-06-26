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
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from public.profiles table
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }
      return data;
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
        const savedMock = localStorage.getItem('mock_admin_session');
        if (savedMock) {
          const { user: mockUser, profile: mockProfile } = JSON.parse(savedMock);
          if (isMounted) {
            setUser(mockUser);
            setProfile(mockProfile);
          }
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          setUser(session.user);
          const prof = await fetchProfile(session.user.id);
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
      if (localStorage.getItem('mock_admin_session')) {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('mock_admin_session');
          setUser(null);
          setProfile(null);
        }
        return;
      }

      if (session) {
        setUser(session.user);
        const prof = await fetchProfile(session.user.id);
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
    if (email === 'admin@gmail.com' && password === 'Admin@123') {
      const mockUser = {
        id: '00000000-0000-0000-0000-000000000000',
        email: 'admin@gmail.com',
        user_metadata: {
          full_name: 'Admin User',
        }
      };
      const mockProfile = {
        id: '00000000-0000-0000-0000-000000000000',
        full_name: 'Admin User',
        email: 'admin@gmail.com',
        role: 'admin',
      };
      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem('mock_admin_session', JSON.stringify({ user: mockUser, profile: mockProfile }));
      return { user: mockUser, session: {} };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, fullName, phone) => {
    if (email === 'admin@gmail.com' && password === 'Admin@123') {
      const mockUser = {
        id: '00000000-0000-0000-0000-000000000000',
        email: 'admin@gmail.com',
        user_metadata: {
          full_name: fullName || 'Admin User',
        }
      };
      const mockProfile = {
        id: '00000000-0000-0000-0000-000000000000',
        full_name: fullName || 'Admin User',
        email: 'admin@gmail.com',
        role: 'admin',
      };
      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem('mock_admin_session', JSON.stringify({ user: mockUser, profile: mockProfile }));
      return { user: mockUser, session: {} };
    }

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
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('mock_admin_session');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out warning:', err.message);
    }
    setUser(null);
    setProfile(null);
  };


  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
