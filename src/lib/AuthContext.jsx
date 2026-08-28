import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { db } from '@/api/base44Client';
import { getSupabase } from '@/lib/supabase';
import { ensureProfile } from '@/lib/chat-utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  const checkUserAuth = useCallback(async () => {
    try {
      setIsLoadingAuth(true);
      const supabase = getSupabase();

      if (supabase) {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
          const p = await ensureProfile().catch(() => null);
          setProfile(p);
          setIsLoadingAuth(false);
          setAuthChecked(true);
          return;
        }
      }

      // Local / standard auth check
      const currentUser = await db.auth.me();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        const p = await ensureProfile().catch(() => null);
        setProfile(p);
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.warn('Auth status check:', error?.message || 'anonymous');
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  const checkAppState = useCallback(async () => {
    try {
      setIsLoadingPublicSettings(false);
      setAuthError(null);
      await checkUserAuth();
    } catch (error) {
      console.error('Unexpected error in auth initialization:', error);
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, [checkUserAuth]);

  useEffect(() => {
    checkAppState();

    const supabase = getSupabase();
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            if (newSession?.user) {
              setSession(newSession);
              setUser(newSession.user);
              setIsAuthenticated(true);
              ensureProfile().then(setProfile).catch(() => {});
            }
          } else if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setProfile(null);
            setIsAuthenticated(false);
          }
        }
      );

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [checkAppState]);

  useEffect(() => {
    const handleProfileUpdated = (event) => {
      if (event.detail) setProfile(event.detail);
    };
    window.addEventListener('whisper-profile-updated', handleProfileUpdated);
    return () => window.removeEventListener('whisper-profile-updated', handleProfileUpdated);
  }, []);

  const login = async (identifier, password) => {
    const res = await db.auth.loginViaUsernamePassword(identifier, password);
    if (res?.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      const p = await ensureProfile().catch(() => null);
      setProfile(p);
    }
    return res;
  };

  const linkProvider = async (provider, returnTo = '/settings') => {
    const res = await db.auth.linkProvider(provider, returnTo);
    return res;
  };

  const loginWithProvider = async (provider, returnTo = '/') => {
    const res = await db.auth.loginWithProvider(provider, returnTo);
    if (res?.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      const p = await ensureProfile().catch(() => null);
      setProfile(p);
    }
    return res;
  };

  const loginAsGuest = async (customName) => {
    const res = await db.auth.loginAsGuest(customName);
    if (res?.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      const p = await ensureProfile().catch(() => null);
      setProfile(p);
    }
    return res;
  };

  const register = async (data) => {
    const res = await db.auth.register(data);
    if (res?.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      const p = await ensureProfile().catch(() => null);
      setProfile(p);
    }
    return res;
  };

  const verifyOtp = async (data) => {
    const res = await db.auth.verifyOtp(data);
    if (res?.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      const p = await ensureProfile().catch(() => null);
      setProfile(p);
    }
    return res;
  };

  const logout = async (shouldRedirect = true) => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAuthenticated(false);

    if (shouldRedirect) {
      await db.auth.logout('/login');
    } else {
      await db.auth.logout();
    }
  };

  const navigateToLogin = () => {
    db.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        login,
        loginWithProvider,
        linkProvider,
        loginAsGuest,
        register,
        verifyOtp,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
