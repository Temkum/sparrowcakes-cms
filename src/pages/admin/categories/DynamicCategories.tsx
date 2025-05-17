import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import './dynamic-categories.css';
import { categoryOptionSchema } from '@/form-schema/categoryOptionSchema';
import axios from 'axios';

type Category = z.infer<typeof categoryOptionSchema>;
type Option = { value: number; label: string };

const API_URL = import.meta.env.VITE_API_BASE_URL;

export function DynamicCategories({
  name,
  label,
  isRequired,
}: DynamicCategories) {
  const { control } = useFormContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories/all`);
        // Ensure the data is an array
        const data = Array.isArray(response.data) ? response.data : [];
        // Validate the data against the schema
        const validatedCategories = data.filter((item) => {
          try {
            return categoryOptionSchema.parse(item);
          } catch (error) {
            console.error('Validation error:', error);
            toast.error('Invalid category data');
            console.error('Invalid category data:', item);
            return false;
          }
        });
        setCategories(validatedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories.');
        setCategories([]); // Ensure categories is always an array
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    selectedOption: readonly Option[] | null,
    field: { onChange: (value: number[] | null) => void }
  ) => {
    const selectedValues = selectedOption
      ? selectedOption.map((option) => option.value)
      : null;
    field.onChange(selectedValues);
  };

  const getSelectOptions = (categories: Category[]) => {
    return categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
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
              onChange={(selectedOptions) =>
                handleChange(selectedOptions, field)
              }
              value={getSelectOptions(categories).find(
                (option) => option.value === field.value
              )}
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable
              isClearable
              menuPortalTarget={document.body} // Add this for proper positioning
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (provided) => ({
                  ...provided,
                  minHeight: '44px',
                  borderColor: error ? '#ef4444' : '#cccccc',
                }),
              }}
            />
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
        );
      }}
    />
  );
}
