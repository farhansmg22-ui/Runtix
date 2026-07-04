import { User } from '../types';

export function getToken(): string | null {
  return localStorage.getItem('runtix_token');
}

export function getUser(): User | null {
  const userStr = localStorage.getItem('runtix_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: User) {
  localStorage.setItem('runtix_token', token);
  localStorage.setItem('runtix_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('runtix_token');
  localStorage.removeItem('runtix_user');
}

export function getAuthHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
