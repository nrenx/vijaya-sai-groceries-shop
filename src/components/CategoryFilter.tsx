
import React from 'react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="overflow-x-auto scrollbar-hide pb-2">
      <div className="flex space-x-2 md:justify-center min-w-max">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors",
              selectedCategory === category
                ? "bg-vs-purple text-white"
                : "bg-white hover:bg-gray-100 text-gray-700"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
