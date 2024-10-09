"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!auth.user) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          auth.setUser(JSON.parse(storedUser));
          router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
      setLoading(false);
    };

    checkAuth();
  }, [auth, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ ...auth, setUser: auth.setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);