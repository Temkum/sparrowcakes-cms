import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

const TopMenu: React.FC = () => {
  const [placeholder, setPlaceholder] = React.useState('Search...');

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex-1">
        {/* Other components or content goes here */}
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="w-full max-w-xs relative">
        <Input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10"
          onChange={() => setPlaceholder('')}
          onFocus={() => setPlaceholder('')}
          onBlur={(e) => {
            if (!e.target.value) {
              e.target.setAttribute('placeholder', 'Search...');
            }
          }}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
    </div>
  );
};

export default TopMenu;
