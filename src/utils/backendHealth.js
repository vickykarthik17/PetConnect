import axios from 'axios';

// Use environment variable, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 30000; // 30 seconds
const MAX_RETRIES = 3;

let isHealthy = false;
let healthCheckInterval = null;
let currentRetryDelay = INITIAL_RETRY_DELAY;
let retryCount = 0;
let lastError = null;
let lastCheckTime = null;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  withCredentials: true
});

export const checkConnection = async () => {
  try {
    lastCheckTime = new Date(); // Update check time before attempting
    const response = await axiosInstance.get('/ping');
    if (response.status === 200) {
      isHealthy = true;
      currentRetryDelay = INITIAL_RETRY_DELAY;
      retryCount = 0;
      lastError = null;
      return true;
    }
    isHealthy = false;
    return false;
  } catch (error) {
    isHealthy = false;
    console.error('Backend connection check failed:', {
      status: error.response?.status,
      message: error.message,
      code: error.code
    });
    lastError = error;
    return false;
  }
};

export const startHealthCheck = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }

  const check = async () => {
    try {
      const isConnected = await checkConnection();
      
      if (isConnected) {
        console.log('Backend is healthy');
        isHealthy = true;
        currentRetryDelay = INITIAL_RETRY_DELAY;
        retryCount = 0;
      } else {
        handleHealthCheckFailure();
      }
    } catch (error) {
      handleHealthCheckFailure();
    }
  };

  // Initial check
  check();

  // Set up interval for subsequent checks
  healthCheckInterval = setInterval(check, 30000); // Check every 30 seconds
  
  return () => {
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
    }
  };
};

const handleHealthCheckFailure = () => {
  isHealthy = false;
  console.warn(`Backend health check failed. Retrying in ${currentRetryDelay/1000} seconds...`);
  
  retryCount++;
  if (retryCount <= MAX_RETRIES) {
    // Implement exponential backoff
    setTimeout(async () => {
      const isConnected = await checkConnection();
      if (!isConnected) {
        currentRetryDelay = Math.min(currentRetryDelay * 2, MAX_RETRY_DELAY);
      }
    }, currentRetryDelay);
  } else {
    console.error('Maximum retry attempts reached. Backend might be down.');
  }
};

export const isBackendAvailable = () => isHealthy;

export const getConnectionStatus = () => ({
  isHealthy,
  lastCheckTime,
  retryCount,
  currentDelay: currentRetryDelay,
  lastError: lastError ? {
    message: lastError.message,
    code: lastError.code,
    status: lastError.response?.status
  } : null
});

export const withBackendFallback = async (operation, fallback) => {
  if (await checkConnection()) {
    try {
      return await operation();
    } catch (error) {
      console.error('Operation failed:', error);
      return fallback();
    }
  }
  return fallback();
};

// Add an interceptor to handle CORS and network errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error:', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message
      });
      isHealthy = false;
      lastError = error;
    }
    return Promise.reject(error);
  }
);

export default {
  startHealthCheck,
  isBackendAvailable,
  withBackendFallback,
  checkConnection,
  getConnectionStatus
}; 