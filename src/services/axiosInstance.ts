import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from 'axios';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

// Extend the Window interface to include custom config
interface AxiosConfig {
  logging?: {
    enabled: boolean;
    filter?: {
      method?: string;
      urlPattern?: RegExp;
    };
  };
}

declare global {
  interface Window {
    __MY_APP_AXIOS_CONFIG__?: AxiosConfig;
  }
}

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

// Environment-specific configuration
const isDevelopment = import.meta.env.DEV;

// Enhanced error response type
interface ApiErrorResponse {
  message?: string;
  errors?: string[] | Record<string, string[]>;
  code?: string;
  details?: unknown;
  status?: number;
  timestamp?: string;
}

interface AxiosInstanceWithUtils extends AxiosInstance {
  cancelAllRequests: () => void;
  cancelRequestsMatching: (pattern: string | RegExp) => void;
  getPendingRequestCount: () => number;
  getRequestHealth: () => {
    pendingCount: number;
    oldestRequest: number;
    averageAge: number;
  };
  configureLogging: (config: {
    enabled: boolean;
    filter?: { method?: string; urlPattern?: RegExp };
  }) => void;
  configureRetries: (config: Partial<typeof RETRY_CONFIG>) => void;
  configureCleanup: (config: Partial<typeof CLEANUP_CONFIG>) => void;
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
        console.error('Failed to parse response:', error);
        throw new Error('Invalid JSON response from server');
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

// Cleanup configuration
const CLEANUP_CONFIG = {
  interval: 60000, // 1 minute
  requestTimeout: 300000, // 5 minutes
};

// Cleanup old requests periodically
const cleanupOldRequests = (): void => {
  const now = Date.now();
  pendingRequests.forEach((request, key) => {
    if (now - request.timestamp > CLEANUP_CONFIG.requestTimeout) {
      request.controller.abort('Request expired');
      pendingRequests.delete(key);
    }
  });
};

// Start cleanup interval
let cleanupIntervalId = setInterval(
  cleanupOldRequests,
  CLEANUP_CONFIG.interval
);

// Generate unique key for request deduplication
const generateRequestKey = (config: InternalAxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  const dataHash = data
    ? JSON.stringify(data, Object.keys(data as object).sort())
    : '';
  const paramsHash = params
    ? JSON.stringify(params, Object.keys(params as object).sort())
    : '';
  return `${method?.toUpperCase()}-${url}-${paramsHash}-${dataHash}`;
};

// Request interceptor with token handling
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get fresh token synchronously
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

      // Enhanced logging with filtering
      /* if (isDevelopment && window.__MY_APP_AXIOS_CONFIG__?.logging?.enabled) {
        const loggingConfig = window.__MY_APP_AXIOS_CONFIG__?.logging;
        const shouldLog =
          !loggingConfig?.filter ||
          loggingConfig.filter.method?.toLowerCase() ===
            config.method?.toLowerCase() ||
          loggingConfig.filter.urlPattern?.test(config.url || '');

        if (shouldLog) {
          console.group(
            `🚀 [${
              config.metadata.requestId
            }] ${config.method?.toUpperCase()} ${config.url}`
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
      } */

      return config;
    } catch (error) {
      console.error('Request Setup Error:', error);
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

// Enhanced HTTP error messages with severity
const httpErrorMessages: Record<
  number,
  { message: string; severity: 'low' | 'medium' | 'high' }
> = {
  400: { message: 'Bad request. Please check your input.', severity: 'medium' },
  401: {
    message: 'Your session has expired. Please log in again.',
    severity: 'high',
  },
  403: {
    message: 'You do not have permission to perform this action.',
    severity: 'medium',
  },
  404: { message: 'The requested resource was not found.', severity: 'medium' },
  408: { message: 'Request timeout. Please try again.', severity: 'low' },
  409: {
    message: 'A conflict occurred. The resource may have been modified.',
    severity: 'medium',
  },
  422: {
    message: 'The provided data is invalid. Please check your input.',
    severity: 'medium',
  },
  429: {
    message: 'Too many requests. Please wait a moment before trying again.',
    severity: 'low',
  },
  500: {
    message: 'A server error occurred. Please try again later.',
    severity: 'high',
  },
  502: {
    message: 'Service temporarily unavailable. Please try again later.',
    severity: 'high',
  },
  503: { message: 'Service is currently under maintenance.', severity: 'high' },
  504: {
    message: 'The request took too long to complete. Please try again.',
    severity: 'low',
  },
};

// Enhanced database error codes
const dbErrorMessages: Record<
  string,
  { message: string; severity: 'low' | 'medium' | 'high' }
> = {
  '23505': {
    message: 'This value already exists. Please choose a different one.',
    severity: 'medium',
  },
  '23503': {
    message: 'Cannot delete this item as it is referenced by other records.',
    severity: 'medium',
  },
  '23514': {
    message: 'The provided value violates a business rule.',
    severity: 'medium',
  },
  '23000': {
    message: 'A data integrity violation occurred.',
    severity: 'medium',
  },
  '42P01': { message: 'Database table not found.', severity: 'high' },
  '42703': { message: 'Database column not found.', severity: 'high' },
};

// Enhanced retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableErrorCodes: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'],
};

// Calculate delay with jitter
const calculateRetryDelay = (attempt: number): number => {
  const delay =
    RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, attempt - 1);
  const jitter = Math.random() * 0.1 * delay;
  return Math.min(delay + jitter, RETRY_CONFIG.maxDelay);
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Check if error is retryable
const isRetryableError = (
  error: AxiosError,
  config: InternalAxiosRequestConfig
): boolean => {
  if (config.headers?.['x-retry-enabled'] === 'false') {
    return false;
  }
  if (
    !error.response &&
    RETRY_CONFIG.retryableErrorCodes.includes(error.code || '')
  ) {
    return true;
  }
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
    const requestKey = generateRequestKey(config);
    pendingRequests.delete(requestKey);

    /* if (
      isDevelopment &&
      config.metadata?.startTime &&
      window.__MY_APP_AXIOS_CONFIG__?.logging?.enabled
    ) {
      const loggingConfig = window.__MY_APP_AXIOS_CONFIG__?.logging;
      const shouldLog =
        !loggingConfig?.filter ||
        loggingConfig.filter.method?.toLowerCase() ===
          config.method?.toLowerCase() ||
        loggingConfig.filter.urlPattern?.test(config.url || '');

      if (shouldLog) {
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
    } */

    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (originalRequest) {
      const requestKey = generateRequestKey(originalRequest);
      pendingRequests.delete(requestKey);
    }

    /* if (
      isDevelopment &&
      originalRequest?.metadata?.startTime &&
      window.__MY_APP_AXIOS_CONFIG__?.logging?.enabled
    ) {
      const loggingConfig = window.__MY_APP_AXIOS_CONFIG__?.logging;
      const shouldLog =
        !loggingConfig?.filter ||
        loggingConfig.filter.method?.toLowerCase() ===
          originalRequest?.method?.toLowerCase() ||
        loggingConfig.filter.urlPattern?.test(originalRequest?.url || '');

      if (shouldLog) {
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
    } */

    // Enhanced retry logic with rate limiting support
    const shouldRetry =
      originalRequest &&
      !originalRequest._retryCount &&
      isRetryableError(error, originalRequest) &&
      error.code !== 'ERR_CANCELED';

    if (shouldRetry) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount <= RETRY_CONFIG.maxRetries) {
        let delay = calculateRetryDelay(originalRequest._retryCount);

        // Handle 429 with Retry-After header
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          if (retryAfter) {
            const retryAfterMs = parseInt(retryAfter, 10) * 1000;
            if (!isNaN(retryAfterMs)) {
              delay = retryAfterMs;
            }
          }
        }

        if (isDevelopment) {
          console.log(
            `🔄 Retrying request (attempt ${originalRequest._retryCount}/${RETRY_CONFIG.maxRetries}) after ${delay}ms`
          );
        }

        await sleep(delay);

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

    return handleApiError(error);
  }
);

// Separate error handling function
const handleApiError = (error: AxiosError<ApiErrorResponse>) => {
  if (error.code === 'ERR_CANCELED') {
    return Promise.reject(error);
  }

  if (!error.response) {
    let message = 'Network error. Please check your connection.';
    let severity: 'low' | 'medium' | 'high' = 'medium';

    if (error.code === 'ECONNABORTED') {
      message = 'Request timeout. Please try again.';
      severity = 'low';
    } else if (error.code === 'ENOTFOUND') {
      message = 'Server not found. Please try again later.';
      severity = 'high';
    }

    showError(message, severity);
    return Promise.reject(error);
  }

  const { status, data } = error.response;

  if (data?.message) {
    showError(data.message, httpErrorMessages[status]?.severity || 'medium');
    if (status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(new Error(data.message));
  }

  if (Array.isArray(data?.errors)) {
    const messages = data.errors.join(', ');
    showError(messages, 'medium');
    return Promise.reject(new Error(messages));
  }

  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat().join(', ');
    showError(messages, 'medium');
    return Promise.reject(new Error(messages));
  }

  if (data?.code && dbErrorMessages[data.code]) {
    const { message, severity } = dbErrorMessages[data.code];
    showError(message, severity);
    return Promise.reject(new Error(message));
  }

  const { message, severity } = httpErrorMessages[status] || {
    message: 'An unexpected error occurred',
    severity: 'high' as const,
  };
  showError(message, severity);

  if (status === 401) {
    handleUnauthorized();
  }

  return Promise.reject(error);
};

// Centralized error display function with severity-based duration
const showError = (message: string, severity: 'low' | 'medium' | 'high') => {
  const duration = {
    low: 3000,
    medium: 5000,
    high: 8000,
  }[severity];

  toast.error(message, {
    position: 'bottom-center',
    duration,
    id: message,
  });
};

// Enhanced unauthorized handling
const handleUnauthorized = () => {
  const authStore = useAuthStore.getState();
  cancelAllRequests();
  authStore.logoutUser();

  const currentPath = window.location.pathname;
  const authPaths = ['/login', '/register', '/forgot-password'];

  if (!authPaths.some((path) => currentPath.includes(path))) {
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

export const getRequestHealth = () => {
  return {
    pendingCount: pendingRequests.size,
    oldestRequest:
      Math.min(
        ...Array.from(pendingRequests.values()).map((r) => r.timestamp)
      ) || Date.now(),
    averageAge:
      Array.from(pendingRequests.values()).reduce(
        (sum, r) => sum + (Date.now() - r.timestamp),
        0
      ) / pendingRequests.size || 0,
  };
};

// Configuration utilities
export const configureLogging = (config: {
  enabled: boolean;
  filter?: { method?: string; urlPattern?: RegExp };
}) => {
  window.__MY_APP_AXIOS_CONFIG__ = {
    ...window.__MY_APP_AXIOS_CONFIG__,
    logging: config,
  };
};

export const configureRetries = (config: Partial<typeof RETRY_CONFIG>) => {
  Object.assign(RETRY_CONFIG, config);
};

export const configure = (config: Partial<typeof CLEANUP_CONFIG>) => {
  Object.assign(CLEANUP_CONFIG, config);
  clearInterval(cleanupIntervalId);
  cleanupIntervalId = setInterval(cleanupOldRequests, CLEANUP_CONFIG.interval);
};

// Initialize based on environment
if (isDevelopment) {
  configureLogging({ enabled: true });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  cancelAllRequests();
});

export default axiosInstance;
