'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { categories } from '@/utilities/data';

function CategoryList({
  categories,
  activeCategory,
  onCategoryClick,
}: {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryClick(category.id)}
          className={`border rounded-md w-full px-6 py-4 text-left transition-colors hover:bg-gray-50 mb-2 ${
            activeCategory === category.id ? 'bg-gray-50' : ''
          }`}
        >
          <div className="flex flex-col justify-start">
            <span
              className={`${
                activeCategory === category.id
                  ? 'text-emerald-500'
                  : 'text-gray-900'
              }`}
            >
              {category.name}
            </span>
            <span className="text-sm text-gray-500">
              ({category.itemCount} items)
            </span>
          </div>
        </button>
      ))}
      <div className="px-6 py-4 border rounded-md">
        <Button
          variant="link"
          className="p-0 h-auto text-emerald-500 hover:text-emerald-600"
        >
          View More
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function BannerCard({ banner }: { banner: Banner }) {
  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden">
      <img
        src={banner.image || '/placeholder.svg'}
        alt={banner.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 p-6">
        <div className="text-white">
          <div className="text-6xl font-bold flex">
            {banner.discount}
            <div className="flex flex-col text-sm justify-center">
              <span>%</span>
              <span className="font-light">OFF</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-6 flex flex-col justify-end items-center w-full">
        <h3 className="text-2xl font-bold text-white mb-4">{banner.title}</h3>
        <Button className="w-fit bg-emerald-500 hover:bg-black hover:text-white hover:border-white">
          Shop Now
        </Button>
      </div>
    </div>
  );
}

export default function CategoriesSection() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const activeBanners =
    categories.find((c) => c.id === activeCategory)?.banners || [];

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-5">
            <CategoryList
              categories={categories}
              activeCategory={activeCategory}
              onCategoryClick={setActiveCategory}
            />
          </div>

          {/* Banners Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBanners.map((banner, index) => (
              <BannerCard key={index} banner={banner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
