import axios from 'axios';

const API_URL = 'http://localhost:8082/api';
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;
const PING_TIMEOUT = 2000; // 2 seconds for ping
const HEALTH_CHECK_TIMEOUT = 5000; // 5 seconds for health check

let isBackendHealthy = false;
let healthCheckInterval = null;
let lastHealthCheckTime = null;
let connectionAttempts = 0;
let lastError = null;

const checkConnection = async () => {
  try {
    // Try to ping the server first with a short timeout
    await axios.get(`${API_URL}/ping`, {
      timeout: PING_TIMEOUT,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    return true;
  } catch (error) {
    console.warn('Ping failed:', error.message);
    lastError = error;
    return false;
  }
};

export const checkBackendHealth = async () => {
  try {
    // First check if we can establish a basic connection
    const canConnect = await checkConnection();
    if (!canConnect) {
      isBackendHealthy = false;
      return false;
    }

    // If we can connect, try the full health check
    const response = await axios.get(`${API_URL}/health`, {
      timeout: HEALTH_CHECK_TIMEOUT,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    isBackendHealthy = response.status === 200;
    lastHealthCheckTime = new Date();
    connectionAttempts = 0;
    lastError = null;
    return isBackendHealthy;
  } catch (error) {
    console.error('Backend health check failed:', error);
    isBackendHealthy = false;
    lastError = error;
    connectionAttempts++;
    
    // If we've failed multiple times, try to diagnose the issue
    if (connectionAttempts >= MAX_RETRIES) {
      console.warn('Multiple connection failures. Possible issues:');
      console.warn('1. Backend server is not running');
      console.warn('2. Network connectivity issues');
      console.warn('3. Firewall blocking the connection');
      console.warn('4. Backend server is overloaded');
      console.warn('Last error:', error.message);
    }
    
    return false;
  }
};

export const startHealthCheck = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  // Initial check
  checkBackendHealth();
  
  // Periodic checks with exponential backoff
  let checkInterval = HEALTH_CHECK_INTERVAL;
  healthCheckInterval = setInterval(async () => {
    const wasHealthy = isBackendHealthy;
    const isNowHealthy = await checkBackendHealth();
    
    if (wasHealthy !== isNowHealthy) {
      console.log(`Backend status changed: ${wasHealthy ? 'healthy' : 'unhealthy'} -> ${isNowHealthy ? 'healthy' : 'unhealthy'}`);
      
      // If backend became healthy, reset the interval
      if (isNowHealthy) {
        checkInterval = HEALTH_CHECK_INTERVAL;
        clearInterval(healthCheckInterval);
        healthCheckInterval = setInterval(checkBackendHealth, checkInterval);
      }
      // If backend became unhealthy, increase the interval
      else {
        checkInterval = Math.min(checkInterval * 2, 300000); // Max 5 minutes
        clearInterval(healthCheckInterval);
        healthCheckInterval = setInterval(checkBackendHealth, checkInterval);
      }
    }
  }, checkInterval);
  
  return () => {
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
    }
  };
};

export const isBackendAvailable = () => isBackendHealthy;

export const getLastHealthCheckTime = () => lastHealthCheckTime;

export const getConnectionStatus = () => ({
  isHealthy: isBackendHealthy,
  lastCheck: lastHealthCheckTime,
  attempts: connectionAttempts,
  lastError: lastError ? {
    message: lastError.message,
    code: lastError.code,
    status: lastError.response?.status
  } : null
});

export const withBackendFallback = async (operation, fallback) => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      if (!isBackendHealthy) {
        const canConnect = await checkConnection();
        if (!canConnect) {
          console.warn('Cannot connect to backend, using fallback');
          return fallback();
        }
        
        const isHealthy = await checkBackendHealth();
        if (!isHealthy) {
          console.warn('Backend is unhealthy, using fallback');
          return fallback();
        }
      }
      
      return await operation();
    } catch (error) {
      console.error('Operation failed:', error);
      lastError = error;
      retries++;
      
      if (retries >= MAX_RETRIES) {
        console.warn('Max retries reached, using fallback');
        return fallback();
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
  
  return fallback();
}; 