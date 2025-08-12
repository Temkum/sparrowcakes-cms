import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { NavLink } from 'react-router-dom';

export function NavMenu() {
  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4"></div>

        <div className="relative flex-grow max-w-lg mx-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    cn(
                      navigationMenuTriggerStyle(),
                      isActive
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : ''
                    )
                  }
                >
                  <NavigationMenuLink>
                    <span>Home</span>
                  </NavigationMenuLink>
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  to="/reviews"
                  className={({ isActive }) =>
                    cn(
                      navigationMenuTriggerStyle(),
                      isActive
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : ''
                    )
                  }
                >
                  <NavigationMenuLink>
                    <span>Reviews</span>
                  </NavigationMenuLink>
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    cn(
                      navigationMenuTriggerStyle(),
                      isActive
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : ''
                    )
                  }
                >
                  <NavigationMenuLink>
                    <span>Products</span>
                  </NavigationMenuLink>
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  to="/offers"
                  className={({ isActive }) =>
                    cn(
                      navigationMenuTriggerStyle(),
                      isActive
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : ''
                    )
                  }
                >
                  <NavigationMenuLink>
                    <span>Offers</span>
                  </NavigationMenuLink>
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-4"></div>
      </nav>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">
            <span>{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
