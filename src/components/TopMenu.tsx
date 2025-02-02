import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

const TopMenu: React.FC = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex-1">
        {/* Other components or content goes here */}
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="w-full max-w-xs">
        <Input
          type="text"
          placeholder="Search..."
          className="w-full pl-10"
          icon={
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          }
        />
      </div>
    </div>
  );
};

export default TopMenu;
