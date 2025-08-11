import { Filter } from 'lucide-react';

interface FilterBarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const FilterBar = ({ sortBy, onSortChange }: FilterBarProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
        >
          <option value="discount_desc">Highest Discount</option>
          <option value="discount_asc">Lowest Discount</option>
          <option value="time_asc">Ending Soon</option>
          <option value="time_desc">Most Time Left</option>
          <option value="price_asc">Lowest Price</option>
          <option value="price_desc">Highest Price</option>
          <option value="newest">Newest Arrivals</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
