import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import CategoriesTable from '@/pages/admin/categories/CategoriesTable';
import { Toaster } from '@/components/ui/toaster';
import { useMemo } from 'react';

export default function CategoriesPage() {
  const breadcrumbItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Categories', href: '#' },
    ],
    []
  );

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="w-full p-8  max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mt-4 mb-8">
          <h1 className="text-2xl font-bold">Categories</h1>
        </div>

        <CategoriesTable />

        <Toaster />
      </div>
    </>
  );
}
