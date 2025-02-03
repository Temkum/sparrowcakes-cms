import { NavMenu } from '@/components/NavMenu';
import TopNav from '@/components/sparrow/TopNav';
import React from 'react';
import { Outlet } from 'react-router-dom';

const BaseLayout: React.FC = () => {
  return (
    <>
      <TopNav />
      <NavMenu />
      <Outlet />
    </>
  );
};

export default BaseLayout;
