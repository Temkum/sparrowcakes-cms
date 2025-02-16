import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, Edit, CheckCircle, XCircle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  parent: string;
  visibility: boolean;
  updatedDate: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'qui ut illum',
    parent: '',
    visibility: true,
    updatedDate: 'Sep 24, 2024',
  },
  {
    id: '2',
    name: 'neque quis dolorem',
    parent: 'qui ut illum',
    visibility: true,
    updatedDate: 'Dec 11, 2024',
  },
  {
    id: '3',
    name: 'pariatur perferendis quasi',
    parent: 'qui ut illum',
    visibility: true,
    updatedDate: 'Jan 22, 2025',
  },
  {
    id: '4',
    name: 'reiciendis praesentium quia',
    parent: 'qui ut illum',
    visibility: false,
    updatedDate: 'Jan 14, 2025',
  },
  {
    id: '5',
    name: 'non sit placeat',
    parent: '',
    visibility: true,
    updatedDate: 'Sep 21, 2024',
  },
];

export function CategoriesTable() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="font-bold text-black-600 hover:bg-gray-100 bg-gray-200">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedCategories.length === categories.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories(categories.map((c) => c.id));
                  } else {
                    setSelectedCategories([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>
              <div className="flex items-center justify-between">
                Name
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center justify-between">
                Parent
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center justify-between">
                Visibility
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center justify-between">
                Updated Date
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([
                        ...selectedCategories,
                        category.id,
                      ]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((id) => id !== category.id)
                      );
                    }
                  }}
                />
              </TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.parent}</TableCell>
              <TableCell>
                {category.visibility ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </TableCell>
              <TableCell>{category.updatedDate}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-500 hover:text-orange-600"
                >
                  <Edit className="h-4 w-4" />
                  <span className="ml-2">Edit</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm">Per page</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
