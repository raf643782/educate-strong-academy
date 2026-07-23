import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('es_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public auth pages a user could legitimately be on when a 401 fires (e.g.
// a wrong-password attempt on /auth/login itself). Never force-redirect
// away from these — that would create a redirect loop or interrupt a flow
// that doesn't require an existing session in the first place.
const PUBLIC_AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

function isOnPublicAuthPath(): boolean {
  return PUBLIC_AUTH_PATHS.some(path => window.location.pathname.startsWith(path));
}

// Any expired/invalid token surfaces as a 401 from an authenticated route.
// Clear it and send the user back to Login, rather than leaving pages in
// a broken half-authenticated state until they happen to notice.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !isOnPublicAuthPath()) {
      localStorage.removeItem('es_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
