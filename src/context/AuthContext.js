import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const DEMO_SESSION_KEY = '@novavoz/demo-session/v1';

const AuthContext = createContext(null);

const demoUser = {
    id: 'demo',
    email: 'visitante@novavoz.app',
    user_metadata: { full_name: 'Visitante' },
};

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [demoMode, setDemoMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        let subscription;

        async function bootstrap() {
            const savedDemo = await AsyncStorage.getItem(DEMO_SESSION_KEY);
            if (savedDemo === 'active' && mounted) setDemoMode(true);

            if (supabase) {
                const { data } = await supabase.auth.getSession();
                if (mounted) {
                    setSession(data.session);
                    if (data.session) setDemoMode(false);
                }
                const listener = supabase.auth.onAuthStateChange((_event, nextSession) => {
                    if (mounted) {
                        setSession(nextSession);
                        if (nextSession) setDemoMode(false);
                    }
                });
                subscription = listener.data.subscription;
            }

            if (mounted) setLoading(false);
        }

        bootstrap();
        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    const value = useMemo(() => ({
        session,
        user: session?.user || (demoMode ? demoUser : null),
        loading,
        isDemo: demoMode,
        isConfigured: isSupabaseConfigured,
        async signIn(email, password) {
            if (!supabase) throw new Error('Conecte o Supabase para entrar com uma conta.');
            const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
            if (error) throw error;
        },
        async signUp(fullName, email, password) {
            if (!supabase) throw new Error('Conecte o Supabase para criar uma conta.');
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: { data: { full_name: fullName.trim() } },
            });
            if (error) throw error;
            return { needsEmailConfirmation: !data.session };
        },
        async resetPassword(email) {
            if (!supabase) throw new Error('Conecte o Supabase para redefinir sua senha.');
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
            if (error) throw error;
        },
        async enterDemo() {
            await AsyncStorage.setItem(DEMO_SESSION_KEY, 'active');
            setDemoMode(true);
        },
        async signOut() {
            await AsyncStorage.removeItem(DEMO_SESSION_KEY);
            if (session && supabase) await supabase.auth.signOut();
            setDemoMode(false);
            setSession(null);
        },
    }), [demoMode, loading, session]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const value = useContext(AuthContext);
    if (!value) throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
    return value;
}
