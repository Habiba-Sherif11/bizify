import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bizify-backend.onrender.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail?.[0]?.msg || 
      error.response?.data?.detail || 
      error.message || 
      "An unexpected error occurred";
    
    return Promise.reject(new Error(message));
  }
);