// FILE: client/src/lib/api.ts
// Centralized API service for all backend communication

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ========== Token Management ==========
export const getToken = (): string | null => localStorage.getItem('skillnet_token');
export const setToken = (token: string) => localStorage.setItem('skillnet_token', token);
export const removeToken = () => localStorage.removeItem('skillnet_token');

export const getUser = () => {
  const user = localStorage.getItem('skillnet_user');
  return user ? JSON.parse(user) : null;
};
export const setUser = (user: any) => localStorage.setItem('skillnet_user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('skillnet_user');

export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = '/auth';
};

export const isLoggedIn = (): boolean => !!getToken();

// ========== Base Fetch Helper ==========
const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  // Auto-logout on 401
  if (res.status === 401 && endpoint !== '/auth/login') {
    logout();
    throw new Error('Session expired');
  }

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ========== AUTH API ==========
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  verifyOtp: (email: string, otp: string) =>
    request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// ========== USER API ==========
export const userAPI = {
  getProfile: () => request('/users/profile'),

  updateProfile: (data: any) =>
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  search: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users/search?${query}`);
  },

  getById: (id: string) => request(`/users/${id}`),
};

// ========== QUESTIONS API ==========
export const questionAPI = {
  create: (data: { title: string; description: string; tags: string[] }) =>
    request('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (params?: { tag?: string; page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.tag) query.set('tag', params.tag);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.search) query.set('search', params.search);
    return request(`/questions?${query.toString()}`);
  },

  getById: (id: string) => request(`/questions/${id}`),

  addAnswer: (questionId: string, content: string) =>
    request(`/questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  upvoteQuestion: (id: string) =>
    request(`/questions/${id}/upvote`, { method: 'POST' }),

  upvoteAnswer: (id: string) =>
    request(`/questions/answers/${id}/upvote`, { method: 'POST' }),
};

// ========== HACKATHON API ==========
export const hackathonAPI = {
  create: (data: { title: string; description: string; requiredSkills: string[] }) =>
    request('/hackathon/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => request('/hackathon'),

  getMy: () => request('/hackathon/my'),

  invite: (hackathonId: string, userId: string) =>
    request(`/hackathon/invite/${hackathonId}/${userId}`, { method: 'POST' }),

  respond: (hackathonId: string, inviteId: string, action: 'accept' | 'reject') =>
    request(`/hackathon/respond/${hackathonId}/${inviteId}`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),

  apply: (hackathonId: string) =>
    request(`/hackathon/apply/${hackathonId}`, { method: 'POST' }),
};

// ========== CONNECTIONS API ==========
export const connectionAPI = {
  send: (userId: string) =>
    request(`/connections/send/${userId}`, { method: 'POST' }),

  accept: (connectionId: string) =>
    request(`/connections/accept/${connectionId}`, { method: 'POST' }),

  reject: (connectionId: string) =>
    request(`/connections/reject/${connectionId}`, { method: 'POST' }),

  getAll: () => request('/connections'),

  getPending: () => request('/connections/pending'),
};

// ========== CHAT API ==========
export const chatAPI = {
  getUsers: () => request('/chats/users'),

  getMessages: (userId: string, limit = 50) =>
    request(`/chats/messages/${userId}?limit=${limit}`),
};
