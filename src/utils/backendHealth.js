import axios from 'axios';

const API_URL = 'http://localhost:8082/api';
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;

let isBackendHealthy = false;
let healthCheckInterval = null;

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 5000, // 5 second timeout for health check
    });
    isBackendHealthy = response.status === 200;
    return isBackendHealthy;
  } catch (error) {
    console.error('Backend health check failed:', error);
    isBackendHealthy = false;
    return false;
  }
};

export const startHealthCheck = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  // Initial check
  checkBackendHealth();
  
  // Periodic checks
  healthCheckInterval = setInterval(checkBackendHealth, HEALTH_CHECK_INTERVAL);
  
  return () => {
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
    }
  };
};

export const isBackendAvailable = () => isBackendHealthy;

export const withBackendFallback = async (operation, fallback) => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      if (!isBackendHealthy) {
        await checkBackendHealth();
      }
      
      if (isBackendHealthy) {
        return await operation();
      }
      
      retries++;
      await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
    } catch (error) {
      console.error('Operation failed:', error);
      retries++;
      if (retries >= MAX_RETRIES) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
  
  // If all retries failed, use fallback
  return fallback();
}; 