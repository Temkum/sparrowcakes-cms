import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from 'axios';

// Extend the Axios config interface to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      requestId?: string;
      startTime?: number;
      [key: string]: unknown;
    };
    _retryCount?: number;
  }
}

import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

// Environment-specific configuration
const isDevelopment = import.meta.env.DEV;
// const isProduction = import.meta.env.PROD;

interface AxiosInstanceWithUtils extends AxiosInstance {
  cancelAllRequests: () => void;
  cancelRequestsMatching: (pattern: string | RegExp) => void;
  getPendingRequestCount: () => number;
  getRequestHealth: () => { activeRequests: number; recentErrors: number };
  configureLogging: (enabled: boolean) => void;
  configureRetries: (config: Partial<typeof RETRY_CONFIG>) => void;
}

const axiosInstance: AxiosInstanceWithUtils = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: isDevelopment ? 30000 : 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  transformResponse: [
    (data: string) => {
      try {
        return data ? JSON.parse(data) : data;
      } catch (error) {
        if (error instanceof Error) {
          console.error('Failed to parse response:', error.message);
        }
        return data;
      }
    },
  ],
}) as AxiosInstanceWithUtils;

// Request deduplication map with cleanup
interface PendingRequest {
  controller: AbortController;
  timestamp: number;
}

const pendingRequests = new Map<string, PendingRequest>();

// Cleanup old requests periodically
const CLEANUP_INTERVAL = 60000; // 1 minute
const REQUEST_TIMEOUT = 300000; // 5 minutes

const cleanupOldRequests = (): void => {
  const now = Date.now();
  pendingRequests.forEach((request, key) => {
    if (now - request.timestamp > REQUEST_TIMEOUT) {
      request.controller.abort('Request expired');
      pendingRequests.delete(key);
    }
  });
};

// Start cleanup interval
setInterval(cleanupOldRequests, CLEANUP_INTERVAL);

// Generate unique key for request deduplication
const generateRequestKey = (config: InternalAxiosRequestConfig): string => {
  const { method, url, params, data } = config;

  // Create a more stable hash for data
  const dataHash = data
    ? JSON.stringify(data, Object.keys(data as object).sort())
    : '';
  const paramsHash = params
    ? JSON.stringify(params, Object.keys(params as object).sort())
    : '';

  return `${method?.toUpperCase()}-${url}-${paramsHash}-${dataHash}`;
};

// Request interceptor with improved token handling
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      // Get fresh token from store each time
      const token = useAuthStore.getState().token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add request ID for tracking
      config.metadata = {
        ...config.metadata,
        requestId: crypto.randomUUID(),
        startTime: Date.now(),
      };

      // Request deduplication (only for GET requests by default)
      const shouldDedupe =
        config.method?.toLowerCase() === 'get' ||
        config.headers?.['x-dedupe'] === 'true';

      if (shouldDedupe) {
        const requestKey = generateRequestKey(config);

        // Cancel previous identical request if still pending
        if (pendingRequests.has(requestKey)) {
          const pendingRequest = pendingRequests.get(requestKey);
          pendingRequest?.controller.abort('Duplicate request cancelled');
          pendingRequests.delete(requestKey);
        }

        // Create new abort controller for this request
        const controller = new AbortController();
        config.signal = controller.signal;
        pendingRequests.set(requestKey, {
          controller,
          timestamp: Date.now(),
        });
      }

      // Enhanced logging in development
      if (isDevelopment) {
        console.group(
          `🚀 [${config.metadata.requestId}] ${config.method?.toUpperCase()} ${
            config.url
          }`
        );
        console.log('Config:', {
          url: config.url,
          method: config.method,
          headers: {
            ...config.headers,
            Authorization: token ? '[REDACTED]' : undefined,
          },
          params: config.params,
          data: config.data,
          timeout: config.timeout,
        });
        console.groupEnd();
      }

      return config;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Request Setup Error:', error.message);
      }
      return Promise.reject(error);
    }
  },
  (error) => {
    if (isDevelopment) {
      console.error('❌ Request Setup Error:', error);
    }
    return Promise.reject(error);
  }
);

// Enhanced HTTP error messages
const httpErrorMessages: Record<number, string> = {
  400: 'Bad request. Please check your input.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  408: 'Request timeout. Please try again.',
  409: 'A conflict occurred. The resource may have been modified.',
  422: 'The provided data is invalid. Please check your input.',
  429: 'Too many requests. Please wait a moment before trying again.',
  500: 'A server error occurred. Please try again later.',
  502: 'Service temporarily unavailable. Please try again later.',
  503: 'Service is currently under maintenance.',
  504: 'The request took too long to complete. Please try again.',
};

// Enhanced database error codes
const dbErrorMessages: Record<string, string> = {
  '23505': 'This value already exists. Please choose a different one.',
  '23503': 'Cannot delete this item as it is referenced by other records.',
  '23514': 'The provided value violates a business rule.',
  '23000': 'A data integrity violation occurred.',
  '42P01': 'Database table not found.',
  '42703': 'Database column not found.',
};

interface ApiErrorResponse {
  message?: string;
  errors?: string[] | Record<string, string[]>;
  code?: string;
  details?: unknown;
  status?: number;
  timestamp?: string;
}

// Enhanced retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableErrorCodes: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'],
};

// Calculate delay with jitter to prevent thundering herd
const calculateRetryDelay = (attempt: number): number => {
  const delay =
    RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, attempt - 1);
  const jitter = Math.random() * 0.1 * delay; // 10% jitter
  return Math.min(delay + jitter, RETRY_CONFIG.maxDelay);
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Check if error is retryable
const isRetryableError = (error: AxiosError): boolean => {
  // Network errors
  if (
    !error.response &&
    RETRY_CONFIG.retryableErrorCodes.includes(error.code || '')
  ) {
    return true;
  }

  // HTTP status codes
  if (
    error.response?.status &&
    RETRY_CONFIG.retryableStatusCodes.includes(error.response.status)
  ) {
    return true;
  }

  return false;
};

// Enhanced response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as InternalAxiosRequestConfig;

    // Clean up pending request
    const requestKey = generateRequestKey(config);
    pendingRequests.delete(requestKey);

    // Enhanced response logging
    if (isDevelopment && config.metadata?.startTime) {
      const duration = Date.now() - config.metadata.startTime;
      console.group(
        `✅ [${config.metadata.requestId}] ${config.method?.toUpperCase()} ${
          config.url
        } (${duration}ms)`
      );
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data:', response.data);
      console.groupEnd();
    }

    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // Clean up pending request
    if (originalRequest) {
      const requestKey = generateRequestKey(originalRequest);
      pendingRequests.delete(requestKey);
    }

    // Enhanced error logging
    if (isDevelopment && originalRequest?.metadata?.startTime) {
      const duration = Date.now() - originalRequest.metadata.startTime;
      console.group(
        `❌ [${
          originalRequest.metadata.requestId
        }] ${originalRequest?.method?.toUpperCase()} ${
          originalRequest?.url
        } (${duration}ms)`
      );
      console.log('Status:', error.response?.status);
      console.log('Error Code:', error.code);
      console.log('Error Message:', error.message);
      console.log('Response Data:', error.response?.data);
      console.groupEnd();
    }

    // Enhanced retry logic
    const shouldRetry =
      originalRequest &&
      !originalRequest._retryCount &&
      isRetryableError(error) &&
      error.code !== 'ERR_CANCELED';

    if (shouldRetry) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount <= RETRY_CONFIG.maxRetries) {
        const delay = calculateRetryDelay(originalRequest._retryCount);

        if (isDevelopment) {
          console.log(
            `🔄 Retrying request (attempt ${originalRequest._retryCount}/${RETRY_CONFIG.maxRetries}) after ${delay}ms`
          );
        }

        await sleep(delay);

        // Create new abort controller for retry
        const controller = new AbortController();
        originalRequest.signal = controller.signal;
        const requestKey = generateRequestKey(originalRequest);
        pendingRequests.set(requestKey, {
          controller,
          timestamp: Date.now(),
        });

        return axiosInstance(originalRequest);
      }
    }

    // Enhanced error handling after retry attempts
    return handleApiError(error);
  }
);

// Separate error handling function for better organization
const handleApiError = (error: AxiosError<ApiErrorResponse>) => {
  // Cancelled requests shouldn't show errors
  if (error.code === 'ERR_CANCELED') {
    return Promise.reject(error);
  }

  // Network error (no response)
  if (!error.response) {
    let message = 'Network error. Please check your connection.';

    if (error.code === 'ECONNABORTED') {
      message = 'Request timeout. Please try again.';
    } else if (error.code === 'ENOTFOUND') {
      message = 'Server not found. Please try again later.';
    }

    showError(message);
    return Promise.reject(error);
  }

  const { status, data } = error.response;

  // Handle server-provided error messages first
  if (data?.message) {
    showError(data.message);

    if (status === 401) {
      handleUnauthorized();
    }

    return Promise.reject(new Error(data.message));
  }

  // Handle validation errors (array format)
  if (Array.isArray(data?.errors)) {
    const messages = data.errors.join(', ');
    showError(messages);
    return Promise.reject(new Error(messages));
  }

  // Handle validation errors (object format like Laravel)
  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat().join(', ');
    showError(messages);
    return Promise.reject(new Error(messages));
  }

  // Handle database error codes
  if (data?.code && dbErrorMessages[data.code]) {
    const message = dbErrorMessages[data.code];
    showError(message);
    return Promise.reject(new Error(message));
  }

  // Fallback to HTTP status error messages
  const message = httpErrorMessages[status] || 'An unexpected error occurred';
  showError(message);

  if (status === 401) {
    handleUnauthorized();
  }

  return Promise.reject(error);
};

// Centralized error display function
const showError = (message: string) => {
  toast.error(message, {
    position: 'bottom-center',
    duration: 5000,
    id: message, // Prevent duplicate toasts
  });
};

// Enhanced unauthorized handling
const handleUnauthorized = () => {
  const authStore = useAuthStore.getState();

  // Cancel all pending requests to prevent further 401s
  cancelAllRequests();

  authStore.logoutUser();

  // Avoid redirect loops
  const currentPath = window.location.pathname;
  const authPaths = ['/login', '/register', '/forgot-password'];

  if (!authPaths.some((path) => currentPath.includes(path))) {
    // Store current path for redirect after login
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    window.location.href = '/login';
  }
};

// Enhanced utility functions
export const cancelAllRequests = () => {
  let cancelledCount = 0;

  pendingRequests.forEach((request) => {
    request.controller.abort('All requests cancelled');
    cancelledCount++;
  });
  pendingRequests.clear();

  if (isDevelopment && cancelledCount > 0) {
    console.log(`🛑 Cancelled ${cancelledCount} pending requests`);
  }
};

export const cancelRequestsMatching = (pattern: string | RegExp) => {
  let cancelledCount = 0;
  const isRegex = pattern instanceof RegExp;

  pendingRequests.forEach((request, key) => {
    const matches = isRegex
      ? pattern.test(key)
      : key.includes(pattern as string);

    if (matches) {
      request.controller.abort(`Request matching "${pattern}" cancelled`);
      pendingRequests.delete(key);
      cancelledCount++;
    }
  });

  if (isDevelopment && cancelledCount > 0) {
    console.log(
      `🛑 Cancelled ${cancelledCount} requests matching "${pattern}"`
    );
  }
};

export const getPendingRequestCount = (): number => {
  return pendingRequests.size;
};

// Request health monitoring
export const getRequestHealth = () => {
  return {
    pendingCount: pendingRequests.size,
    oldestRequest: Math.min(
      ...Array.from(pendingRequests.values()).map((r) => r.timestamp)
    ),
    averageAge:
      Array.from(pendingRequests.values()).reduce(
        (sum, r) => sum + (Date.now() - r.timestamp),
        0
      ) / pendingRequests.size || 0,
  };
};

// Configuration utilities
export const configureLogging = (enabled: boolean) => {
  Object.defineProperty(window, '__AXIOS_LOGGING_ENABLED__', {
    value: enabled,
    writable: true,
  });
};

export const configureRetries = (config: Partial<typeof RETRY_CONFIG>) => {
  Object.assign(RETRY_CONFIG, config);
};

// Initialize based on environment
if (isDevelopment) {
  configureLogging(true);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  cancelAllRequests();
});

export default axiosInstance;
