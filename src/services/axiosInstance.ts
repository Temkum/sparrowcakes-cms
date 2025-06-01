import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

// Environment-specific configuration
const isDevelopment = import.meta.env.ENV === 'development';
// const isProduction = import.meta.env.ENV === 'production';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: isDevelopment ? 30000 : 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request deduplication map
const pendingRequests = new Map<string, AbortController>();

// Generate unique key for request deduplication
const generateRequestKey = (config: InternalAxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  return `${method?.toUpperCase()}-${url}-${JSON.stringify(
    params || {}
  )}-${JSON.stringify(data || {})}`;
};

// Request interceptor with logging and deduplication
axiosInstance.interceptors.request.use(
  (config) => {
    // Get fresh token from store each time
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Request deduplication
    const requestKey = generateRequestKey(config);

    // Cancel previous identical request if still pending
    if (pendingRequests.has(requestKey)) {
      const controller = pendingRequests.get(requestKey);
      controller?.abort('Duplicate request cancelled');
      pendingRequests.delete(requestKey);
    }

    // Create new abort controller for this request
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(requestKey, controller);

    // Logging in development
    if (isDevelopment) {
      console.group(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      console.log('Config:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        params: config.params,
        data: config.data,
      });
      console.groupEnd();
    }

    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// HTTP error messages
const httpErrorMessages: Record<number, string> = {
  400: 'Bad request. Please check your input.',
  401: 'Session expired. Please log in again.',
  403: 'You do not have permission for this action.',
  404: 'Resource not found.',
  408: 'Request timeout. Please try again.',
  409: 'Conflict detected.',
  422: 'Validation error.',
  429: 'Too many requests. Please slow down.',
  500: 'Server error. Please try again later.',
  502: 'Bad gateway. Please try again later.',
  503: 'Service unavailable.',
  504: 'Gateway timeout.',
};

// Database error codes (if your backend exposes them)
const dbErrorMessages: Record<string, string> = {
  '23505': 'This value already exists. Please choose a different one.',
  '23503': 'Related record not found.',
  '23514': 'Check constraint violation.',
  '23000': 'Integrity constraint violation.',
};

interface ApiErrorResponse {
  message?: string;
  errors?: string[] | Record<string, string[]>;
  code?: string;
  details?: unknown;
}

// Exponential backoff retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
};

// Calculate delay with exponential backoff
const calculateRetryDelay = (attempt: number): number => {
  const delay =
    RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, attempt - 1);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
};

// Sleep utility for retry delays
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Response interceptor with logging and progressive retry
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Clean up pending request
    const config = response.config as InternalAxiosRequestConfig;
    const requestKey = generateRequestKey(config);
    pendingRequests.delete(requestKey);

    // Response logging in development
    if (isDevelopment) {
      console.group(
        `✅ API Response: ${config.method?.toUpperCase()} ${config.url}`
      );
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data:', response.data);
      console.groupEnd();
    }

    return response.data;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retryCount?: number;
    };

    // Clean up pending request
    if (originalRequest) {
      const requestKey = generateRequestKey(originalRequest);
      pendingRequests.delete(requestKey);
    }

    // Error logging in development
    if (isDevelopment) {
      console.group(
        `❌ API Error: ${originalRequest?.method?.toUpperCase()} ${
          originalRequest?.url
        }`
      );
      console.log('Status:', error.response?.status);
      console.log('Error:', error.message);
      console.log('Response Data:', error.response?.data);
      console.groupEnd();
    }

    // Progressive retry logic
    const shouldRetry =
      originalRequest &&
      !originalRequest._retryCount &&
      // Retry on 5xx errors (except 504 which is timeout)
      ((error.response?.status &&
        error.response?.status >= 500 &&
        error.response?.status !== 504) ||
        // Retry on network errors (but not cancelled requests)
        (!error.response &&
          error.code !== 'ERR_CANCELED' &&
          error.code !== 'ECONNABORTED'));

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
        pendingRequests.set(requestKey, controller);

        return axiosInstance(originalRequest);
      }
    }

    // Handle errors after retry attempts are exhausted

    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.', {
          position: 'bottom-center',
        });
      } else if (error.code === 'ERR_CANCELED') {
        // Request was cancelled, don't show error
        return Promise.reject(error);
      } else {
        toast.error('Network error. Please check your connection.', {
          position: 'bottom-center',
        });
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle server-provided error messages first
    if (data?.message) {
      toast.error(data.message, { position: 'bottom-center' });

      // Handle 401 logout
      if (status === 401) {
        handleUnauthorized();
      }

      return Promise.reject(new Error(data.message));
    }

    // Handle validation errors (array format)
    if (Array.isArray(data?.errors)) {
      const messages = data.errors.join(', ');
      toast.error(messages, { position: 'bottom-center' });
      return Promise.reject(new Error(messages));
    }

    // Handle validation errors (object format like Laravel)
    if (data?.errors && typeof data.errors === 'object') {
      const messages = Object.values(data.errors).flat().join(', ');
      toast.error(messages, { position: 'bottom-center' });
      return Promise.reject(new Error(messages));
    }

    // Handle database error codes
    if (data?.code && dbErrorMessages[data.code]) {
      const message = dbErrorMessages[data.code];
      toast.error(message, { position: 'bottom-center' });
      return Promise.reject(new Error(message));
    }

    // Fallback to HTTP status error messages
    const message = httpErrorMessages[status] || 'An unexpected error occurred';
    toast.error(message, { position: 'bottom-center' });

    // Handle 401 logout
    if (status === 401) {
      handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

// Centralized unauthorized handling
const handleUnauthorized = () => {
  const authStore = useAuthStore.getState();
  authStore.logoutUser();

  // Avoid redirect loops
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

// Utility function to cancel all pending requests
export const cancelAllRequests = () => {
  pendingRequests.forEach((controller) => {
    controller.abort('All requests cancelled');
  });
  pendingRequests.clear();

  if (isDevelopment) {
    console.log('🛑 All pending requests cancelled');
  }
};

// Utility function to cancel specific request pattern
export const cancelRequestsMatching = (pattern: string) => {
  let cancelledCount = 0;

  pendingRequests.forEach((controller, key) => {
    if (key.includes(pattern)) {
      controller.abort(`Request matching "${pattern}" cancelled`);
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

// Utility function to get pending request count
export const getPendingRequestCount = (): number => {
  return pendingRequests.size;
};

// Environment-specific logging configuration
export const configureLogging = (enabled: boolean) => {
  // In a real app, you might want to store this in a global state or config
  Object.defineProperty(window, '__AXIOS_LOGGING_ENABLED__', {
    value: enabled,
    writable: true,
  });
};

// Initialize logging based on environment
if (isDevelopment) {
  configureLogging(true);
}

export default axiosInstance;
