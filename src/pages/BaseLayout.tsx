import { NavMenu } from '@/components/NavMenu';
import React from 'react';
import { Outlet } from 'react-router-dom';

const BaseLayout: React.FC = () => {
  return (
    <>
      <NavMenu />
      <Outlet />
    </>
  );
};

export default BaseLayout;
