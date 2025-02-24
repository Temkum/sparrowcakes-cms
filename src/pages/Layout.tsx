import { AppSidebar } from '@/components/AppSidebar';
import TopMenu from '@/components/TopMenu';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopMenu />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
