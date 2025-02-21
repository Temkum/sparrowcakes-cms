import { useEffect, useState } from 'react';
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
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function CategoriesTable() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // get all categories
  const [categories, setCategories] = useState<Category[]>([]);

  console.log('first', categories);

  useEffect(() => {
    try {
      axios
        .get(`${API_BASE_URL}/categories`)
        .then((res) => setCategories(res.data));
    } catch (error) {
      console.error(error);
      // Display an error message to the user
      alert('Failed to load categories');
    }
  }, []);
  // get all products

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
            <TableHead>Image</TableHead>
            <TableHead>
              <div className="flex items-center justify-between">
                Name
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center justify-between">
                Description
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
              <TableCell>
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-10 h-10 rounded object-cover"
                />
              </TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                {category.is_active ? (
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
