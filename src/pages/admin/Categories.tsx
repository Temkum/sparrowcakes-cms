import { CategoriesTable } from '@/components/CategoriesTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoriesPage() {
  return (
    <div className="w-full p-8  max-w-[1280px] mx-auto">
      {/* Breadcrumb */}
      {/* <Breadcrumb
        items={[
          { label: 'Products', href: '/admin/products' },
          { label: 'Categories', href: '/admin/categories' },
          { label: 'List', href: '/categories' },
        ]}
      /> */}

      {/* Header */}
      <div className="flex items-center justify-between mt-4 mb-8">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex gap-3">
          <Button variant="outline">Import categories</Button>
          <Link to="/categories/new">
            <Button className="bg-orange-500 hover:bg-orange-600">
              New category
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-[400px] mb-6 bg-white">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Search" className="pl-10" />
      </div>

      {/* Table */}
      <CategoriesTable />
    </div>
  );
}
