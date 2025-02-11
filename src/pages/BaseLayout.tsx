import { NavMenu } from '@/components/NavMenu';
import Footer from '@/components/sparrow/Footer';
import TopNav from '@/components/sparrow/TopNav';
import React from 'react';
import { Outlet } from 'react-router-dom';

const BaseLayout: React.FC = () => {
  return (
    <>
      <TopNav />
      <NavMenu />
      <Outlet />
      <Footer />
    </>
  );
};

export default BaseLayout;
