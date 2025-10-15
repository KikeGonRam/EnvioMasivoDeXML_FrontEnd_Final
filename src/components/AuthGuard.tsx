'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * Redirige al login si no hay token
 */
export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = api.isAuthenticated();
      
      if (!authenticated) {
        // Redirigir al login del BackFinal
  const backendLoginUrl = process.env.NEXT_PUBLIC_BACKEND_LOGIN || 'http://46.202.177.106:5000/login';
        window.location.href = backendLoginUrl;
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Ya se redirigió
  }

  return <>{children}</>;
}

/**
 * Tipo de usuario decodificado del JWT
 */
export interface UserInfo {
  id: number;
  nombre: string;
  email: string;
  departamento_id?: number;
  rol?: string;
}

/**
 * Hook personalizado para obtener información del usuario
 */
export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userInfo = api.getUserInfo();
    setUser(userInfo);
  }, []);

  return {
    user,
    isAuthenticated: api.isAuthenticated(),
    logout: () => {
      // Limpiar ambos tokens por si acaso
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
  window.location.href = process.env.NEXT_PUBLIC_BACKEND_LOGIN || 'http://46.202.177.106:5000/login';
    }
  };
}
