import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import { CategoriesTable } from '@/components/CategoriesTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreateCategoryModal } from './CreateCategoryModal';
import { Toaster } from '@/components/ui/toaster';
import axios from 'axios';

const breadcrumbItems = [
  {
    label: 'Cakes By Sparrow',
    href: '/admin/dashboard',
  },
  { label: 'Categories', href: '/admin/categories' },
];

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      const fetchedCategories = response.data;
      // Update the state with the fetched categories
      // For example:
      setCategories(fetchedCategories);
      console.log('Categories fetched:', fetchedCategories);
      // return fetchedCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="w-full p-8  max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mt-4 mb-8">
          <h1 className="text-2xl font-bold">Categories</h1>
          <div className="flex gap-3">
            <Button variant="outline">Import categories</Button>
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

        {/* Search */}
        <div className="relative w-[400px] mb-6 bg-white">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search" className="pl-10" />
        </div>

        {/* Table */}
        <CategoriesTable />

        <CreateCategoryModal
          open={open}
          onOpenChange={setOpen}
          onSuccess={() => {
            setOpen(false);
          }}
        />

        <Toaster />
      </div>
    </>
  );
}
