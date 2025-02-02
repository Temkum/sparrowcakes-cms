import { AppSidebar } from '@/components/AppSidebar';
import Header from '@/components/Header';
import TopMenu from '@/components/TopMenu';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Dashboard from './Dashboard';

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopMenu />
        <Header />
        <Dashboard />
      </SidebarInset>
    </SidebarProvider>
  );
}
