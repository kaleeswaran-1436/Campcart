import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// Define the base URL - adjust based on your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Create an Axios instance with JWT interceptor for multi-tenant requests
 */
export const createApiClient = (tenantId?: string): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: Attach JWT token and tenant ID to headers
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add tenant ID if provided
      if (tenantId) {
        config.headers['X-Tenant-ID'] = tenantId;
      }

      // Get JWT token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle token expiration and errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 Unauthorized - token expired
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }

      // Handle 403 Forbidden - access denied
      if (error.response?.status === 403) {
        console.error('Access forbidden:', error.response.data);
        if (typeof window !== 'undefined') {
          window.location.href = '/unauthorized';
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Default API client instance (without tenant ID, will be added in interceptor)
export const api = createApiClient();

/**
 * API endpoints for the marketplace
 */
export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    uploadId: '/auth/upload-id',
    verify: '/auth/verify',
    me: '/auth/me',
  },
  products: {
    list: '/products',
    create: '/products',
    getOne: (id: string) => `/products/${id}`,
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    search: '/products/search',
  },
  uploads: {
    image: '/uploads/image',
    document: '/uploads/document',
  },
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
  },
};

/**
 * Type-safe API request wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

/**
 * Helper function for API requests with error handling
 */
export const makeRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  endpoint: string,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await api[method]<ApiResponse<T>>(endpoint, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status,
        message: error.response?.data?.message || error.message,
        error: error.response?.data?.error,
      };
    }
    throw error;
  }
};

export default api;
