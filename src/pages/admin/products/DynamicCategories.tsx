import React, { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// This would come from your API or a dedicated categories service in a real application
interface Category {
  id: number; // Changed to number to match schema
  name: string;
}

interface DynamicCategoriesProps {
  selectedCategories: number[]; // Changed to number[] to match schema
  onChange: (categories: number[]) => void;
}

export const DynamicCategories: React.FC<DynamicCategoriesProps> = ({
  selectedCategories = [],
  onChange,
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
        // In a real app, replace with your actual API
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback with mock data
        setCategories([
          { id: 1, name: 'Cakes' },
          { id: 2, name: 'Cupcakes' },
          { id: 3, name: 'Cookies' },
          { id: 4, name: 'Pastries' },
          { id: 5, name: 'Breads' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: number) => {
    const currentCategories = [...selectedCategories];
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
      // In a real app, this would be an API call to create a new category
      const newCategoryObj = {
        id: Date.now(), // Generate temporary numeric ID
        name: newCategory.trim(),
      };

      // Add to local state
      setCategories((prev) => [...prev, newCategoryObj]);

      // Select the new category
      onChange([...selectedCategories, newCategoryObj.id]);

      // Reset form
      setNewCategory('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  return (
    <div className="space-y-3">
      {loading ? (
        <div className="text-sm text-gray-500">Loading categories...</div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  checked={selectedCategories.includes(category.id)}
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
