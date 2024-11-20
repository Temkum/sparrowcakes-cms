import HeaderTop from './ui/HeaderTop';
import HeaderBottom from './ui/HeaderBottom';
import HeaderMenu from './ui/HeaderMenu';
import MobileMenuSidebar from './ui/MobileMenuSidebar';
import { useState } from 'react';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (e: MouseEvent) => {
    e.preventDefault();
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="gi-header">
      <HeaderTop toggleSidebar={toggleSidebar} />
      <HeaderBottom />
      <HeaderMenu />
      <MobileMenuSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </header>
  );
};

export default Header;
