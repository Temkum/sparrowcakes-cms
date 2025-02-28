import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { dbCategories } from '@/utilities/data';

interface MultiSelectCategoriesProps {
  selectedValues: number[];
  onChange: (newSelection: number[]) => void;
  maxItems?: number;
}

const MultiSelectCategories: React.FC<MultiSelectCategoriesProps> = ({
  selectedValues = [],
  onChange,
  maxItems = 5,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCategories = dbCategories.filter(
    (category: { id: number; name: string }) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (categoryId: number) => {
    const newSelection =
      Array.isArray(selectedValues) && selectedValues.includes(categoryId)
        ? selectedValues.filter((id) => id !== categoryId)
        : [
            ...(Array.isArray(selectedValues) ? selectedValues : []),
            categoryId,
          ];

    onChange(newSelection);
  };

  const getSelectedNames = () => {
    if (!Array.isArray(selectedValues) || selectedValues.length === 0)
      return 'Select categories...';

    const selected = dbCategories
      .filter((cat) => selectedValues.includes(cat.id))
      .map((cat) => cat.name);

    if (selected.length <= maxItems) return selected.join(', ');
    return `${selected.length} categories selected`;
  };

  if (loading) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Loading categories...
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1 items-center">
            {Array.isArray(selectedValues) &&
            selectedValues.length > 0 &&
            selectedValues.length <= maxItems ? (
              dbCategories
                .filter((cat: { id: number; name: string }) =>
                  selectedValues.includes(cat.id)
                )
                .map((cat: { id: number; name: string }) => (
                  <Badge key={cat.id} variant="secondary" className="mr-1">
                    {cat.name}
                  </Badge>
                ))
            ) : (
              <span>{getSelectedNames()}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search categories..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No categories found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {filteredCategories.map(
              (category: { id: number; name: string }) => (
                <CommandItem
                  key={category.id}
                  onSelect={() => toggleCategory(category.id)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      Array.isArray(selectedValues) &&
                        selectedValues.includes(category.id)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {category.name}
                </CommandItem>
              )
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectCategories;
