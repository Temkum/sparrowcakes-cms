import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      // Use provided fallback or default UI
      return this.props.fallback || (
        <DefaultErrorFallback 
          error={this.state.error} 
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Default fallback component
export const DefaultErrorFallback = ({
  error,
  errorInfo,
  onReset,
}: {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="max-w-md w-full space-y-6 text-center bg-white p-8 rounded-lg shadow-lg">
      <div className="text-red-500 mx-auto w-16 h-16 mb-4">
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
      <p className="text-gray-600">
        We're sorry, but an unexpected error has occurred.
      </p>
      {error && (
        <details className="mt-4 text-left text-sm text-gray-600 bg-gray-50 p-4 rounded">
          <summary className="font-medium cursor-pointer">Error details</summary>
          <div className="mt-2">
            <p className="font-semibold">{error.message}</p>
            {errorInfo?.componentStack && (
              <pre className="mt-2 text-xs overflow-auto max-h-40 p-2 bg-gray-100 rounded">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        </details>
      )}
      <Button
        onClick={onReset}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white"
      >
        Try again
      </Button>
      <div className="mt-4 text-sm">
        <p className="text-gray-500">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  </div>
);
