import axios from 'axios';

import { useLoaderContext } from '../loader/contectLoader'; // Adjust path as needed

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Access-Control-Allow-Origin': import.meta.env.VITE_CURRENT_URL,
    'Access-Control-Allow-Methods': 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers':
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'X-Requested-With': '*',
  },
});

const getToken = () => localStorage.getItem('token');

const interceptorsSetup = (showLoader, hideLoader) => {
  // Add request interceptor to dynamically attach token
  api.interceptors.request.use(
    async (config) => {
      showLoader();
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Remove content-type header for FormData
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      return config;
    },
    (error) => {
      hideLoader();
      return Promise.reject(error);
    }
  );

  // Add response interceptor to hide the loader
  api.interceptors.response.use(
    (response) => {
      hideLoader();
      return response;
    },
    (error) => {
      hideLoader();
      return Promise.reject(error);
    }
  );
};

// Initialize interceptors outside the hooks to avoid multiple setups
let interceptorsInitialized = false;

export const useApi = () => {
  const { showLoader, hideLoader } = useLoaderContext();

  // Initialize interceptors only once
  if (!interceptorsInitialized) {
    interceptorsSetup(showLoader, hideLoader);
    interceptorsInitialized = true;
  }

  // Exporting API methods individually
  const get = async (url, params = {}) => {
    const response = await api.get(url, { params });
    return response.data;
  };

  const post = async (url, data) => {
    const response = await api.post(url, data);
    return response.data;
  };

  const put = async (url, data) => {
    const response = await api.put(url, data);
    return response.data;
  };

  const patch = async (url, data) => {
    const response = await api.patch(url, data);
    return response.data;
  };

  const deleted = async (url, data) => {
    const response = await api.delete(url, { data });
    return response.data;
  };

  return { get, post, put, patch, deleted };
};
