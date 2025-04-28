# Senior-Level React TypeScript Guidelines

## Component Architecture

- Create functional components with proper TypeScript typing

  ```typescript
  type ButtonProps = {
    variant: 'primary' | 'secondary';
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
  };

  const Button = ({
    variant,
    onClick,
    disabled = false,
    children,
  }: ButtonProps): JSX.Element => {
    return (
      <button
        className={`btn btn-${variant}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };
  ```

- Implement container/presenter pattern for complex components

  ```typescript
  // Container component
  const UserProfileContainer = (): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchUser = async (): Promise<void> => {
        try {
          setIsLoading(true);
          const userData = await userService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }, []);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error.message} />;
    if (!user) return <NotFoundMessage resource="User" />;

    return <UserProfilePresenter user={user} />;
  };

  // Presenter component
  type UserProfilePresenterProps = {
    user: User;
  };

  const UserProfilePresenter = ({
    user,
  }: UserProfilePresenterProps): JSX.Element => {
    return (
      <div className="user-profile">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        {/* Additional UI elements */}
      </div>
    );
  };
  ```

- Use React.memo for component memoization, with proper type definition

  ```typescript
  type UserCardProps = {
    user: User;
    onSelect: (userId: string) => void;
  };

  const UserCard = React.memo<UserCardProps>(({ user, onSelect }) => {
    const handleClick = useCallback(() => {
      onSelect(user.id);
    }, [user.id, onSelect]);

    return (
      <div className="user-card" onClick={handleClick}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  });
  ```

- Define proper children typing with React.PropsWithChildren

  ```typescript
  type CardProps = React.PropsWithChildren<{
    title: string;
    className?: string;
  }>;

  const Card = ({ title, className, children }: CardProps): JSX.Element => {
    return (
      <div className={`card ${className || ''}`}>
        <div className="card-header">
          <h2>{title}</h2>
        </div>
        <div className="card-content">{children}</div>
      </div>
    );
  };
  ```

## TypeScript Best Practices

- Configure strict TypeScript settings in tsconfig.json

  ```json
  {
    "compilerOptions": {
      "target": "es2019",
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "noFallthroughCasesInSwitch": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "noImplicitAny": true,
      "noImplicitThis": true,
      "strictNullChecks": true,
      "baseUrl": "src",
      "paths": {
        "@components/*": ["components/*"],
        "@hooks/*": ["hooks/*"],
        "@utils/*": ["utils/*"],
        "@services/*": ["services/*"],
        "@types/*": ["types/*"]
      }
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "build"]
  }
  ```

- Use discriminated unions for type-safe state management

  ```typescript
  type RequestState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };

  const UserProfile = (): JSX.Element => {
    const [state, setState] = useState<RequestState<User>>({ status: 'idle' });

    useEffect(() => {
      const fetchUser = async (): Promise<void> => {
        setState({ status: 'loading' });
        try {
          const user = await userService.getCurrentUser();
          setState({ status: 'success', data: user });
        } catch (error) {
          setState({
            status: 'error',
            error: error instanceof Error ? error : new Error('Unknown error'),
          });
        }
      };

      fetchUser();
    }, []);

    // Type-safe rendering based on state
    switch (state.status) {
      case 'idle':
        return <div>Please click to load user data</div>;
      case 'loading':
        return <LoadingSpinner />;
      case 'error':
        return <ErrorMessage message={state.error.message} />;
      case 'success':
        return <UserDetails user={state.data} />;
    }
  };
  ```

- Implement branded types for domain models

  ```typescript
  // Branded type for user ID to prevent mixing with other ID types
  type UserId = string & { readonly _brand: unique symbol };

  // Create a user ID from a string
  function createUserId(id: string): UserId {
    return id as UserId;
  }

  type User = {
    id: UserId;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
  };

  // This prevents accidental usage of wrong ID types
  function getUserById(id: UserId): Promise<User> {
    return api.get(`/users/${id}`);
  }

  // This would error - type safety!
  // const orderId = '123';
  // getUserById(orderId); // Type error!

  // Correct usage
  const userId = createUserId('123');
  getUserById(userId); // Works fine
  ```

- Use utility types for type manipulation

  ```typescript
  // Original type
  type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
  };

  // For creating a new user (omit system fields)
  type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

  // For updating a user (all fields optional except id)
  type UpdateUserDto = Partial<Omit<User, 'id'>> & { id: string };

  // For user display (omit sensitive fields)
  type UserViewModel = Omit<User, 'password'>;

  // For form state (all fields are strings)
  type UserFormState = {
    [K in keyof Omit<User, 'createdAt' | 'updatedAt'>]: string;
  };
  ```

- Define explicit return types for functions and callbacks

  ```typescript
  // Explicitly typed function
  function formatUserName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
  }

  // Explicitly typed arrow function
  const calculateAge = (birthDate: Date): number => {
    return Math.floor(
      (new Date().getTime() - birthDate.getTime()) / 31557600000
    );
  };

  // Explicitly typed async function
  async function fetchUserData(userId: string): Promise<User> {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return response.json() as Promise<User>;
  }

  // Explicitly typed event handler
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // Form handling logic
  };
  ```

## State Management

- Create custom hooks with proper typing

  ```typescript
  type UseUserResult = {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
  };

  function useUser(userId: string): UseUserResult {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchUser = useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await userService.getUserById(userId);
        setUser(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch user')
        );
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }, [userId]);

    useEffect(() => {
      fetchUser();
    }, [fetchUser]);

    return { user, isLoading, error, refetch: fetchUser };
  }
  ```

- Implement typed reducers with discriminated union actions

  ```typescript
  // Define state type
  type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };

  // Define action types with discriminated union
  type AuthAction =
    | { type: 'AUTH_REQUEST' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_FAILURE'; error: string }
    | { type: 'AUTH_LOGOUT' };

  // Create initial state
  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  // Create reducer with type safety
  function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
      case 'AUTH_REQUEST':
        return {
          ...state,
          isLoading: true,
          error: null,
        };
      case 'AUTH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isAuthenticated: true,
          user: action.payload,
          error: null,
        };
      case 'AUTH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: action.error,
        };
      case 'AUTH_LOGOUT':
        return {
          ...state,
          isAuthenticated: false,
          user: null,
        };
      default:
        return state;
    }
  }

  // Use in component
  const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Provide context
    return (
      <AuthContext.Provider value={{ state, dispatch }}>
        {children}
      </AuthContext.Provider>
    );
  };
  ```

- Create strongly typed context with default values

  ```typescript
  type ThemeContextType = {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  };

  // Create context with non-null assertion for default value
  const ThemeContext = React.createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => {},
  });

  // Provider component
  export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = useCallback(() => {
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    const value = useMemo(
      () => ({
        theme,
        toggleTheme,
      }),
      [theme, toggleTheme]
    );

    return (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
  };

  // Custom hook for using the context
  export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
  };
  ```

- Implement proper cleanup in useEffect hooks

  ```typescript
  type ChatMessage = {
    id: string;
    text: string;
    timestamp: Date;
  };

  const ChatComponent = ({ roomId }: { roomId: string }): JSX.Element => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
      // Connect to chat room
      const socket = chatService.connectToRoom(roomId);

      // Set up message listener
      const messageHandler = (message: ChatMessage) => {
        setMessages((prev) => [...prev, message]);
      };

      socket.on('message', messageHandler);

      // Clean up function - IMPORTANT!
      return () => {
        socket.off('message', messageHandler);
        socket.disconnect();
      };
    }, [roomId]);

    return (
      <div className="chat-container">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
      </div>
    );
  };
  ```

## Performance Optimization

- Implement proper memo and callback usage

  ```typescript
  type UserListProps = {
    users: User[];
    onUserSelect: (userId: string) => void;
    searchQuery: string;
  };

  const UserList = ({
    users,
    onUserSelect,
    searchQuery,
  }: UserListProps): JSX.Element => {
    // Memoize filtered users to prevent recalculation on every render
    const filteredUsers = useMemo(() => {
      return users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [users, searchQuery]);

    // Memoize item renderer to prevent recreation on each render
    const renderUserItem = useCallback(
      (user: User) => {
        const handleClick = () => {
          onUserSelect(user.id);
        };

        return (
          <li key={user.id} onClick={handleClick}>
            {user.name} ({user.email})
          </li>
        );
      },
      [onUserSelect]
    );

    return <ul className="user-list">{filteredUsers.map(renderUserItem)}</ul>;
  };

  // Wrap component in memo to prevent unnecessary renders
  export default React.memo(UserList);
  ```

- Implement code splitting with React.lazy and Suspense

  ```typescript
  import React, { Suspense, lazy } from 'react';
  import { Routes, Route } from 'react-router-dom';
  import LoadingSpinner from './components/LoadingSpinner';

  // Lazy-loaded components
  const Dashboard = lazy(() => import('./pages/Dashboard'));
  const UserProfile = lazy(() => import('./pages/UserProfile'));
  const Settings = lazy(() => import('./pages/Settings'));

  const App = (): JSX.Element => {
    return (
      <div className="app">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </div>
    );
  };
  ```

- Use virtualized lists for large datasets

  ```typescript
  import { FixedSizeList as List } from 'react-window';

  type RowProps = {
    index: number;
    style: React.CSSProperties;
    data: User[];
  };

  const Row = ({ index, style, data }: RowProps): JSX.Element => {
    const user = data[index];
    return (
      <div style={style} className="user-row">
        <span>{user.name}</span>
        <span>{user.email}</span>
      </div>
    );
  };

  const UserVirtualList = ({ users }: { users: User[] }): JSX.Element => {
    return (
      <List
        height={500}
        width="100%"
        itemCount={users.length}
        itemSize={50}
        itemData={users}
      >
        {Row}
      </List>
    );
  };
  ```

- Implement proper key usage for lists

  ```typescript
  type TodoItem = {
    id: string;
    text: string;
    completed: boolean;
  };

  const TodoList = ({ items }: { items: TodoItem[] }): JSX.Element => {
    return (
      <ul className="todo-list">
        {items.map((item) => (
          // Use stable unique identifier as key, NOT index
          <li key={item.id} className={item.completed ? 'completed' : ''}>
            {item.text}
          </li>
        ))}
      </ul>
    );
  };
  ```

## Error Handling

- Implement error boundaries with TypeScript

  ```typescript
  type ErrorBoundaryProps = {
    fallback: React.ReactNode;
    children: React.ReactNode;
  };

  type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
  };

  class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
  > {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
      // Log the error to an error reporting service
      console.error('Error caught by boundary:', error, info);
      logErrorToService(error, info);
    }

    render(): React.ReactNode {
      if (this.state.hasError) {
        return this.props.fallback;
      }

      return this.props.children;
    }
  }

  // Usage
  const App = (): JSX.Element => {
    return (
      <ErrorBoundary
        fallback={
          <div className="error-ui">
            Something went wrong. Please try again.
          </div>
        }
      >
        <UserDashboard />
      </ErrorBoundary>
    );
  };
  ```

- Create typed error handling utilities

  ```typescript
  // Define custom error types
  class ApiError extends Error {
    constructor(
      message: string,
      public statusCode: number,
      public data?: unknown
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }

  class ValidationError extends Error {
    constructor(message: string, public fieldErrors: Record<string, string[]>) {
      super(message);
      this.name = 'ValidationError';
    }
  }

  // Type guard functions
  function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }

  function isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }

  // Utility function for handling errors
  function handleError(error: unknown): string {
    if (isApiError(error)) {
      if (error.statusCode === 401) {
        return 'Please login to continue';
      }
      if (error.statusCode === 403) {
        return "You don't have permission to perform this action";
      }
      return `Server error: ${error.message}`;
    }

    if (isValidationError(error)) {
      const firstError = Object.values(error.fieldErrors)[0]?.[0];
      return firstError || 'Validation failed';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unknown error occurred';
  }
  ```

- Implement global error handling

  ```typescript
  // Create an error context
  type ErrorContextType = {
    error: Error | null;
    setError: (error: Error | null) => void;
    clearError: () => void;
  };

  const ErrorContext = React.createContext<ErrorContextType>({
    error: null,
    setError: () => {},
    clearError: () => {},
  });

  // Provider component
  export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [error, setError] = useState<Error | null>(null);

    const clearError = useCallback(() => {
      setError(null);
    }, []);

    const contextValue = useMemo(
      () => ({
        error,
        setError,
        clearError,
      }),
      [error, clearError]
    );

    useEffect(() => {
      const handleGlobalError = (event: ErrorEvent): void => {
        setError(event.error || new Error(event.message));
        event.preventDefault();
      };

      window.addEventListener('error', handleGlobalError);

      return () => {
        window.removeEventListener('error', handleGlobalError);
      };
    }, []);

    return (
      <ErrorContext.Provider value={contextValue}>
        {error && <GlobalErrorBanner error={error} onDismiss={clearError} />}
        {children}
      </ErrorContext.Provider>
    );
  };

  // Custom hook for using error context
  export const useError = (): ErrorContextType => {
    return useContext(ErrorContext);
  };
  ```

## Testing

- Set up a proper testing environment

  ```typescript
  // src/setupTests.ts
  import '@testing-library/jest-dom';
  import { server } from './mocks/server';

  beforeAll(() => {
    // Start mock server
    server.listen();
  });

  afterEach(() => {
    // Reset mock handlers
    server.resetHandlers();
  });

  afterAll(() => {
    // Clean up after tests
    server.close();
  });
  ```

- Write strongly typed tests with proper mocks

  ```typescript
  import { render, screen, waitFor } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import { UserProfilePage } from './UserProfilePage';
  import { UserService } from '../services/userService';

  // Mock the service
  jest.mock('../services/userService');
  const mockUserService = UserService as jest.Mocked<typeof UserService>;

  describe('UserProfilePage', () => {
    const mockUser: User = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should load and display user profile', async () => {
      // Set up mock implementation
      mockUserService.getUserProfile.mockResolvedValueOnce(mockUser);

      render(<UserProfilePage userId="123" />);

      // Assert loading state
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Wait for user data to load
      await waitFor(() => {
        expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      });

      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith('123');
    });

    it('should handle errors when loading profile', async () => {
      // Set up mock implementation to reject
      const error = new Error('Failed to load user');
      mockUserService.getUserProfile.mockRejectedValueOnce(error);

      render(<UserProfilePage userId="123" />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText(/failed to load user/i)).toBeInTheDocument();
      });
    });

    it('should allow editing the profile', async () => {
      // Set up mock implementations
      mockUserService.getUserProfile.mockResolvedValueOnce(mockUser);
      mockUserService.updateUserProfile.mockResolvedValueOnce({
        ...mockUser,
        name: 'Updated Name',
      });

      render(<UserProfilePage userId="123" />);

      // Wait for user data to load
      await waitFor(() => {
        expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      });

      // Click edit button
      userEvent.click(screen.getByRole('button', { name: /edit/i }));

      // Update name field
      const nameInput = screen.getByLabelText(/name/i);
      userEvent.clear(nameInput);
      userEvent.type(nameInput, 'Updated Name');

      // Submit form
      userEvent.click(screen.getByRole('button', { name: /save/i }));

      // Verify service called with correct data
      expect(mockUserService.updateUserProfile).toHaveBeenCalledWith('123', {
        name: 'Updated Name',
        email: mockUser.email,
      });

      // Wait for updated data
      await waitFor(() => {
        expect(screen.getByText('Updated Name')).toBeInTheDocument();
      });
    });
  });
  ```

## Code Organization

- Implement feature-based folder structure

  ```
  src/
  ├── features/
  │   ├── auth/
  │   │   ├── components/
  │   │   │   ├── LoginForm.tsx
  │   │   │   ├── RegisterForm.tsx
  │   │   ├── hooks/
  │   │   │   ├── useAuth.ts
  │   │   ├── services/
  │   │   │   ├── authService.ts
  │   │   ├── types/
  │   │   │   ├── auth.types.ts
  │   │   ├── index.ts (barrel file)
  │   │   ├── AuthContext.tsx
  │   ├── users/
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   ├── services/
  │   │   ├── types/
  │   │   ├── index.ts
  │   ├── products/
  │       ├── components/
  │       ├── hooks/
  │       ├── services/
  │       ├── types/
  │       ├── index.ts
  ├── shared/
  │   ├── components/
  │   ├── hooks/
  │   ├── utils/
  │   ├── types/
  ├── app/
  │   ├── App.tsx
  │   ├── AppProviders.tsx
  │   ├── routes.tsx
  ├── index.tsx
  ```

- Create barrel files to simplify imports

  ```typescript
  // src/features/users/index.ts
  // Export all from this feature
  export * from './components';
  export * from './hooks';
  export * from './services';
  export * from './types';

  // src/features/users/components/index.ts
  export * from './UserList';
  export * from './UserCard';
  export * from './UserProfile';
  ```

- Use path aliases for cleaner imports

  ```typescript
  // Without path aliases
  import { UserService } from '../../../services/users/userService';
  import { formatDate } from '../../../utils/dateUtils';

  // With path aliases
  import { UserService } from '@services/users/userService';
  import { formatDate } from '@utils/dateUtils';
  ```

## Security

- Implement proper input sanitization

  ```typescript
  import DOMPurify from 'dompurify';

  type CommentProps = {
    content: string;
  };

  const Comment = ({ content }: CommentProps): JSX.Element => {
    // Sanitize HTML to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(content);

    return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
  };
  ```

- Create secure authentication hooks

  ```typescript
  type AuthTokens = {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };

  function useSecureAuth(): {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    error: Error | null;
  } {
    const [tokens, setTokens] = useState<AuthTokens | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    // Check if token is expired
    const isTokenExpired = useCallback((): boolean => {
      if (!tokens) return true;
      return Date.now() >= tokens.expiresAt;
    }, [tokens]);

    // Secure token storage
    const storeTokens = useCallback((newTokens: AuthTokens): void => {
      // Use secure HttpOnly cookies in a real app instead of localStorage
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
      setTokens(newTokens);
    }, []);

    // Login implementation
    const login = useCallback(async (email: string, password: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login(email, password);
        storeTokens(response.tokens);
        setUser(response.user);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Login failed'));
      } finally {
        setIsLoading(false);
      }
    }, [storeTokens]);

    // Logout implementation
    const logout = useCallback((): void => {
      localStorage.removeItem('auth_tokens');
      setTokens(null);
      setUser(null);
    }, []);

    // Auto refresh token when expired
  ```

```jsx
useEffect(() => {
if (!tokens) return;

// Calculate time until expiration
const timeUntilExpiry = tokens.expiresAt - Date.now();
// Refresh 5 minutes before expiration
const refreshTime = Math.max(0, timeUntilExpiry - 5 _ 60 _ 1000);

const refreshTimer = setTimeout(async () => {
try {
const newTokens = await authService.refreshToken(tokens.refreshToken);
storeTokens(newTokens);
} catch (err) {
// If refresh fails, log the user out
logout();
setError(new Error('Session expired. Please log in again.'));
}
}, refreshTime);

return () => clearTimeout(refreshTimer);
}, [tokens, storeTokens, logout]);

// Load user data and tokens on initial mount
useEffect(() => {
const storedTokensString = localStorage.getItem('auth_tokens');

if (storedTokensString) {
try {
const storedTokens = JSON.parse(storedTokensString) as AuthTokens;

      if (Date.now() < storedTokens.expiresAt) {
        // Token is still valid
        setTokens(storedTokens);

        // Fetch current user data
        const fetchUser = async () => {
          setIsLoading(true);
          try {
            const userData = await userService.getCurrentUser();
            setUser(userData);
          } catch (err) {
            // If fetching user fails, clear tokens
            logout();
            setError(new Error('Failed to authenticate. Please log in again.'));
          } finally {
            setIsLoading(false);
          }
        };

        fetchUser();
      } else {
        // Token is expired, try to refresh
        const refreshExpiredToken = async () => {
          try {
            const newTokens = await authService.refreshToken(storedTokens.refreshToken);
            storeTokens(newTokens);
          } catch (err) {
            // Clear invalid tokens
            logout();
          }
        };

        refreshExpiredToken();
      }
    } catch (err) {
      // Invalid token format
      logout();
    }

}
}, [logout, storeTokens]);

return {
login,
logout,
isAuthenticated: !!tokens && !isTokenExpired(),
user,
isLoading,
error
};

// Adding CSRF token to requests
const api = axios.create({
baseURL: '/api',
withCredentials: true, // To include cookies in cross-site requests
});

// Add CSRF token to every request
api.interceptors.request.use(config => {
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
config.headers['X-CSRF-Token'] = csrfToken;
}
return config;
});

// In server-side code or in index.html
const CSP = `  default-src 'self';
  script-src 'self' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://secure-image-host.com;
  connect-src 'self' https://api.example.com;`;
```

// Set the CSP header
// For Express.js:

```tsx
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', CSP);
  next();
});

type SecureFormProps = {
  onSubmit: (data: Record<string, string>) => void;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'password';
    required?: boolean;
    pattern?: string;
    autoComplete?: string;
  }>;
};

const SecureForm = ({ onSubmit, fields }: SecureFormProps): JSX.Element => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} method="POST" autoComplete="off">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            required={field.required}
            pattern={field.pattern}
            onChange={handleChange}
            value={formData[field.name] || ''}
            autoComplete={field.autoComplete || 'off'}
            spellCheck="false"
            autoCorrect="off"
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
```

<!-- secure routing -->

```tsx
type ProtectedRouteProps = {
  element: React.ReactElement;
  allowedRoles?: Array<'admin' | 'user' | 'guest'>;
};

const ProtectedRoute = ({
  element,
  allowedRoles,
}: ProtectedRouteProps): JSX.Element => {
  const { isAuthenticated, user, isLoading } = useSecureAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', {
        replace: true,
        state: { returnUrl: window.location.pathname },
      });
    } else if (
      !isLoading &&
      isAuthenticated &&
      allowedRoles &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      // Redirect to unauthorized page if user doesn't have required role
      navigate('/unauthorized', { replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate, allowedRoles]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null; // Will redirect in useEffect
  }

  return element;
};
```

// Usage in routes

```js
const AppRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            element={<AdminDashboard />}
            allowedRoles={['admin']}
          />
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute
            element={<UserProfile />}
            allowedRoles={['admin', 'user']}
          />
        }
      />
    </Routes>
  );
};
```

## Recommendations for Implementation

Based on the comprehensive guidelines covered in the document, here are my key recommendations for implementing a senior-level React TypeScript application:

### Start with strong typing fundamentals

Configure TypeScript for strict mode
Create well-defined interfaces and types for all components and data models
Use discriminated unions for complex state management

### Build a robust component architecture

Implement container/presenter pattern for complex components
Use custom hooks to encapsulate and reuse logic
Create strongly typed contexts with proper default values

### Focus on performance from the start

Apply proper memoization with useMemo and useCallback
Implement code splitting with React.lazy for large applications
Use virtualized lists for rendering large datasets

### Implement comprehensive error handling

Add error boundaries at strategic levels in the component tree
Create typed error handling utilities
Set up global error management

### Prioritize security

Implement proper input sanitization for any user-generated content
Create secure authentication with token management
Add CSRF protection to all API requests
Implement proper authorization with protected routes

### Organize code for maintainability

Use feature-based folder structure
Create barrel files for clean imports
Set up path aliases for improved developer experience

### Write comprehensive tests

Set up a robust testing environment
Create strongly typed tests with proper mocks
Test both component rendering and business logic

```

```
