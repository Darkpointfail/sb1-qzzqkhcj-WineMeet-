import React from 'react';
import { TrendingUp, Wine } from 'lucide-react';

interface PopularWine {
  name: string;
  sales: number;
  trend: number;
  region: string;
}

export function WinePopularityChart({ wines }: { wines: PopularWine[] }) {
  const maxSales = Math.max(...wines.map(w => w.sales));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-wine-700" />
          <h3 className="text-lg font-semibold text-gray-900">Wine Popularity Trends</h3>
        </div>
      </div>

      <div className="space-y-4">
        {wines.map((wine, index) => (
          <div key={index} className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-wine-600" />
                <span className="font-medium text-gray-900">{wine.name}</span>
              </div>
              <span className="text-sm text-gray-600">{wine.sales.toLocaleString()} sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-grow">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-wine-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(wine.sales / maxSales) * 100}%` }}
                  />
                </div>
              </div>
              <div className={`text-sm ${wine.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {wine.trend > 0 ? '+' : ''}{wine.trend}%
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{wine.region}</div>
          </div>
        ))}
      </div>
    </div>
  );
}