'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BadgeDollarSign,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Gift,
  Map,
  MessageCircleCode,
  PieChart,
  Settings2,
  ShoppingBag,
  SquareTerminal,
  Users,
} from 'lucide-react';

import { NavMain } from '@/components/NavMain';
import { NavShop } from '@/components/NavShop';
import { NavUser } from '@/components/NavUser';
import { TeamSwitcher } from '@/components/TeamSwitcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/auth';

// This is sample data.
const data = {
  user: {
    name: 'Poupe',
    email: 'sparrow@example.com',
    avatar: '/assets/profiles/poupe.png',
  },
  teams: [
    {
      name: 'Cakes By Sparrow',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Delivery Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Beauty Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Categories',
      url: '/admin/categories',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Products',
      url: '/admin/products',
      icon: ShoppingBag,
    },
    {
      title: 'Orders',
      url: '/admin/orders',
      icon: BadgeDollarSign,
    },
    {
      title: 'Customers',
      url: '/admin/customers',
      icon: Users,
    },
    {
      title: 'Reviews',
      url: '/admin/reviews',
      icon: MessageCircleCode,
    },
    {
      title: 'Offers',
      url: '/admin/offers',
      icon: Gift,
    },
    {
      title: 'Site Content',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Generator',
          url: '#',
        },
        {
          title: 'Promotion',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '/admin/users',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  content: [
    {
      name: 'Design',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore().user;

  // fallback if user is not loaded yet
  const sidebarUser = user
    ? {
        name: user.name,
        email: user.email,
        avatar: user.avatar || '/assets/profiles/poupe.png',
      }
    : {
        name: 'Loading...',
        email: '',
        avatar: '/assets/profiles/poupe.png',
      };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavShop projects={data.content} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
