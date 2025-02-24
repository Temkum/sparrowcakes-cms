import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { dbCategories } from '@/utilities/data';
import './dynamic-categories.css';
import { categoryOptionSchema } from '@/form-schema/categoryOptionSchema';

type Category = z.infer<typeof categoryOptionSchema>;

export function DynamicCategories({
  name,
  label,
  isRequired,
}: DynamicCategoriesProps) {
  const { control, setValue } = useFormContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Uncomment the following lines to fetch data using axios
        // const response = await axios.get('/categories');
        // const data = await response.data;
        // setCategories(data);

        // Use dbCategories from data file
        setCategories(dbCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle selection change
  const handleChange = (selectedOptions: any, field: any) => {
    const selectedIds = selectedOptions.map((option: options) => option.value);
    field.onChange(selectedIds); // Update form value with selected IDs
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
          <Select
            isMulti
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            isLoading={isLoading}
            placeholder="Select categories..."
            onChange={(selectedOptions) => handleChange(selectedOptions, field)}
            value={categories
              .filter((category) => field.value?.includes(category.id))
              .map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable
            isClearable
          />
          {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}
