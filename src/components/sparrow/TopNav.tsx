import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Search, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopNav = () => {
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
        </div>
      </div>

      <div className="flex items-center space-x-4 text-2xl">
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
