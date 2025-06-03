import { BreadcrumbProps } from '@/types';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BreadcrumbComponent({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 p-4 font-medium">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          <Link
            to={item.href}
            className={
              index === items.length - 1
                ? 'text-gray-900'
                : 'hover:text-gray-700'
            }
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
