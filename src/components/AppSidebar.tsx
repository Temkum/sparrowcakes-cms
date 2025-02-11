'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
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

// This is sample data.
const data = {
  user: {
    name: 'Poupe',
    email: 'sparrow@example.com',
    avatar: '/avatars/shadcn.jpg',
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
      title: 'Shop',
      url: '/shop',
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: 'Products',
          url: '/admin/products',
        },
        {
          title: 'Orders',
          url: '#',
        },
        {
          title: 'Customers',
          url: '#',
        },
      ],
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
