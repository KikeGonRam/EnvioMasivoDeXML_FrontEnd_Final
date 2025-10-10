// src/lib/api.ts
import type { UserInfo } from '@/components/AuthGuard';

const RAW = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
export const API_BASE = RAW.replace(/\/+$/, ''); // sin / al final

function assertOk(res: Response) {
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
}

/**
 * Obtiene el token de autenticación del localStorage
 * Este token proviene del BackFinal después del login
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Envía un FormData con autenticación
 */
async function postForm(path: string, fd: FormData) {
  const url = `${API_BASE}${path}`;
  const token = getAuthToken();
  
  const headers: HeadersInit = {};
  
  // Agregar token de autenticación si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, { 
    method: 'POST', 
    body: fd,
    headers 
  });
  
  assertOk(res);
  return res.json();
}

export const api = {
  dryRun: (fd: FormData) => postForm('/api/dry-run', fd),
  send:   (fd: FormData) => postForm('/api/send', fd),
  
  // Helper para verificar si el usuario está autenticado
  isAuthenticated: () => !!getAuthToken(),
  
  // Helper para obtener info del usuario del token (sin verificar, solo lectura)
  getUserInfo: (): UserInfo | null => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      // Decodificar el payload del JWT (sin verificar la firma)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id || 0,
        nombre: payload.nombre || 'Usuario',
        email: payload.email || '',
        departamento_id: payload.departamento_id,
        rol: payload.rol
      };
    } catch {
      return null;
    }
  }
};
