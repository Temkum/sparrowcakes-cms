import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import CategoriesTable from '@/pages/admin/categories/CategoriesTable';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import CategoryFormModal from './CategoryFormModal';

const breadcrumbItems = [
  {
    label: 'Cakes By Sparrow',
    href: '/admin/dashboard',
  },
  { label: 'Categories', href: '/admin/categories' },
];

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="w-full p-8  max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mt-4 mb-8">
          <h1 className="text-2xl font-bold">Categories</h1>
          <div className="flex gap-3">
            <Button variant="outline" disabled>
              Import categories
              <span className="text-xs text-gray-500 ml-1">
                (Not functional)
              </span>
            </Button>
            <Link to="/admin/categories/new">
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => setOpen(true)}
              >
                New category
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <CategoriesTable />

        <CategoryFormModal
          open={open}
          onOpenChange={setOpen}
          onSuccess={() => {
            setOpen(false);
          }}
          mode="create"
        />

        <Toaster />
      </div>
    </>
  );
}
