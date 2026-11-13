import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  userRole: 'admin' | 'sales_rep' | null;
};

// Mode démo : en développement (npm run dev), on saute la connexion et on
// ouvre l'app directement avec un faux représentant (rôle sales_rep).
// Pour revenir au vrai login, mettre VITE_DEMO_MODE=false dans .env.
export const DEMO_MODE =
  import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE !== 'false';

const DEMO_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo.representant@winemeet.local',
  app_metadata: {},
  user_metadata: { name: 'Représentant démo' },
  aud: 'authenticated',
  created_at: new Date(0).toISOString(),
} as User;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'sales_rep' | null>(null);

  useEffect(() => {
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      setUserRole('sales_rep');
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserRole(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setUserRole(data.role as 'admin' | 'sales_rep');
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
  }

  async function signOut() {
    if (DEMO_MODE) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  const value = {
    session,
    user,
    signIn,
    signOut,
    loading,
    userRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}