import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProductFormSidebar = () => {
  return (
    <div className="space-y-6 w-full max-w-md">
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="text-base font-medium">Status</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Switch className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
            <Label className="font-normal">Visible</Label>
          </div>
          <p className="text-gray-500 text-sm">
            This product will be hidden from all sales channels.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b px-6 py-4">
          <div className="flex items-center">
            <CardTitle className="text-base font-medium">
              Availability
            </CardTitle>
            <span className="text-red-500 ml-1">*</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            defaultValue="2025-02-22"
          />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="text-base font-medium">Associations</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Brand</Label>
            <Select>
              <SelectTrigger className="w-full border-gray-200 bg-white text-gray-500">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand1">Brand 1</SelectItem>
                <SelectItem value="brand2">Brand 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label className="text-sm font-medium">Categories</Label>
              <span className="text-red-500 ml-1">*</span>
            </div>
            <Select>
              <SelectTrigger className="w-full border-gray-200 bg-white text-gray-500">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category1">Category 1</SelectItem>
                <SelectItem value="category2">Category 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium">
        Create product
      </Button>
    </div>
  );
};

export default ProductFormSidebar;
