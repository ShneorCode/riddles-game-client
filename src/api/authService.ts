import { User } from '../types';

const AUTH_URL = 'http://localhost:3007/api/auth/login';
const REGISTER_URL = 'http://localhost:3007/api/auth/register';

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export async function loginUser(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    }
    console.error('Login failed:', data.message || 'Unknown error');
    return false;
  } catch (error) {
    console.error('Error during login process:', error);
    return false;
  }
}

export async function registerUser(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    }
    console.error('Registration failed:', data.message || 'Unknown error');
    return false;
  } catch (error) {
    console.error('Error during registration process:', error);
    return false;
  }
}

export function logoutUser(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}