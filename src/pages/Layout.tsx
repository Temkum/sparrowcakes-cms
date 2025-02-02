import { AppSidebar } from '@/components/AppSidebar';
import Header from '@/components/Header';
import TopMenu from '@/components/TopMenu';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopMenu />
        <Header />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
