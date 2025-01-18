import React, { useState } from 'react';
import { Wine, TrendingUp, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CategoryTrend {
  category: string;
  sales: number;
  trend: number;
  products: {
    id: string;
    name: string;
    sales: number;
    trend: number;
    stock: number;
    vintage?: string;
  }[];
}

interface CategoryTrendsProps {
  trends: CategoryTrend[];
}

export function CategoryTrends({ trends }: CategoryTrendsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-wine-700" />
          <h3 className="text-lg font-semibold text-gray-900">Category Trends</h3>
        </div>
      </div>

      <div className="space-y-4">
        {trends.map((category) => (
          <div key={category.category} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => handleCategoryClick(category.category)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Wine className="w-5 h-5 text-wine-600" />
                <div>
                  <span className="font-medium text-gray-900">{category.category}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">{category.sales.toLocaleString()} sales</span>
                    <span className={`flex items-center ${getTrendColor(category.trend)}`}>
                      {getTrendIcon(category.trend)}
                      {category.trend > 0 ? '+' : ''}{category.trend}%
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                selectedCategory === category.category ? 'rotate-90' : ''
              }`} />
            </button>

            {selectedCategory === category.category && (
              <div className="divide-y">
                {category.products.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm">
                          <span className="text-gray-600">
                            {product.sales.toLocaleString()} sales
                          </span>
                          <span className={`flex items-center ${getTrendColor(product.trend)}`}>
                            {getTrendIcon(product.trend)}
                            {product.trend > 0 ? '+' : ''}{product.trend}%
                          </span>
                        </div>
                        {product.vintage && (
                          <p className="text-sm text-gray-500 mt-1">
                            Vintage: {product.vintage}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">Current Stock</div>
                        <div className={`text-sm ${
                          product.stock < 50 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {product.stock} bottles
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}