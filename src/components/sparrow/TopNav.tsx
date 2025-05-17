// TopNav.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Search,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const TopNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const logoutUser = useAuthStore.getState().logoutUser;
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="flex items-center justify-between px-6 py-6 bg-white shadow-md">
      {/* Logo on the Left */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-xl font-bold text-primary">
          Cakes by Sparrow
        </Link>
      </div>

      {/* Search Input in the Middle */}
      <div className="relative flex-grow max-w-lg mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-28 py-2 rounded-md border border-gray-300 focus:border-primary focus:outline-none"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Categories <ChevronDown size={16} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Category 1</DropdownMenuItem>
              <DropdownMenuItem>Category 2</DropdownMenuItem>
              <DropdownMenuItem>Category 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Authentication and Language Icons on the Right */}
      <div className="flex items-center space-x-4 text-2xl">
        {/* Authentication */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <User size={35} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isLoggedIn ? (
              <>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                  Logout{' '}
                  <LogOut size={16} className="ml-2" onClick={handleLogout} />
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => setIsLoggedIn(true)}>
                  <Link to="/login" className="flex items-center">
                    Login
                    <LogIn
                      size={16}
                      className="ml-2"
                      onClick={() => setIsLoggedIn(true)}
                    />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/register" className="flex items-center">
                    Register
                    <UserPlus size={16} className="ml-2" />
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe size={35} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Français</DropdownMenuItem>
            <DropdownMenuItem>Español</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default TopNav;
