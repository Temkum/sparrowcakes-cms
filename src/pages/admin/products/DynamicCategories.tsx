import React, { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

// Import the Category interface from the types
interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

// Match the interface in types/category/index.d.ts
interface DynamicCategoriesProps {
  name: string;
  label: string;
  value?: number[];
  onChange: (categories: number[]) => void;
  isRequired?: boolean;
}

export const DynamicCategories: React.FC<DynamicCategoriesProps> = ({
  name,
  label,
  value = [],
  onChange,
  isRequired = false,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/categories');

        if (response && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Unexpected categories response format:', response);
          toast.error('Failed to load categories');
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: number) => {
    const currentCategories = [...value];
    const index = currentCategories.indexOf(categoryId);

    if (index === -1) {
      onChange([...currentCategories, categoryId]);
    } else {
      currentCategories.splice(index, 1);
      onChange(currentCategories);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.trim()) return;

    try {
      const response = await axiosInstance.post('/categories', {
        name: newCategory.trim(),
      });

      if (response && response.data) {
        // Add to local state
        setCategories((prev) => [...prev, response.data]);

        // Select the new category
        onChange([...value, response.data.id]);

        // Reset form
        setNewCategory('');
        setShowAddForm(false);
        toast.success('Category added successfully');
      }
    } catch (error) {
      console.error('Failed to add category:', error);
      toast.error('Failed to add category');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading categories...</div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={name}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  checked={value.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />
                <span>{category.name}</span>
              </label>
            </div>
          ))}
        </div>
      )}

      {showAddForm ? (
        <form onSubmit={handleAddCategory} className="mt-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
            />
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowAddForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center text-sm text-orange-500 hover:text-orange-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add new category
        </button>
      )}
    </div>
  );
};
