import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const vehicleService = {
  getVehicles: async (params: any) => {
    const response = await api.get('/vehicles', { params });
    return response.data;
  },

  getVehicleById: async (id: number) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  createApplication: async (data: any) => {
    const response = await api.post('/applications', data);
    return response.data;
  }
};

export const uploadDocument = async (formData: FormData) => {
  const response = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// src/services/auth.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  login: async ({ email, password }: LoginCredentials) => {
    const response = await axios.post<AuthResponse>('/api/auth/login', {
      email,
      password
    });

    const { access_token } = response.data;
    localStorage.setItem('token', access_token);

    return jwtDecode(access_token);
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp! * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};