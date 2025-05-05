import React from 'react';
import { SidebarTrigger } from './ui/sidebar';

const TopMenu: React.FC = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex-1">
        {/* Other components or content goes here */}
        <SidebarTrigger className="-ml-1" />
      </div>
    </div>
  );
};

export default TopMenu;
