import React from 'react';
import { format } from 'date-fns';
import { Tag, Package, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { promotions, products } from '../data';
import type { Product, Promotion } from '../types';

function PromoPunch() {
  const getProduct = (productId: string): Product | undefined => {
    return products.find(p => p.id === productId);
  };

  const getProgressColor = (current: number, target: number): string => {
    const percentage = (current / target) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPromotionIcon = (type: Promotion['type']) => {
    switch (type) {
      case 'discount':
        return <Tag className="w-5 h-5" />;
      case 'bundle':
        return <Package className="w-5 h-5" />;
      case 'special-offer':
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Tag className="w-8 h-8 text-[#7E003F]" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Promotions</p>
              <p className="text-2xl font-semibold">{promotions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-[#7E003F]" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Sales Target</p>
              <p className="text-2xl font-semibold">
                {promotions.reduce((acc, promo) => acc + promo.targetSales, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-[#7E003F]" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Current Sales</p>
              <p className="text-2xl font-semibold">
                {promotions.reduce((acc, promo) => acc + promo.currentSales, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6">Active Promotions</h2>
          <div className="space-y-6">
            {promotions.map(promotion => {
              const product = getProduct(promotion.productId);
              if (!product) return null;

              const progressPercentage = (promotion.currentSales / promotion.targetSales) * 100;
              const progressColor = getProgressColor(promotion.currentSales, promotion.targetSales);

              return (
                <div key={promotion.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-[#7E003F]/10 rounded-lg">
                        {getPromotionIcon(promotion.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{product.name}</h3>
                          {product.trending && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#7E003F]/10 text-[#7E003F]">
                              Trending
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {promotion.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>Type: {product.type}</span>
                          <span>Region: {product.region}</span>
                          <span>Stock: {product.stock} bottles</span>
                          <span>
                            Valid until: {format(promotion.endDate, 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Sales Progress</div>
                      <div className="text-2xl font-semibold">
                        {promotion.currentSales}/{promotion.targetSales}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-4 flex flex-wrap gap-4">
                    {promotion.discount && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {promotion.discount}% Off
                      </span>
                    )}
                    {promotion.minimumPurchase && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Min. Purchase: {promotion.minimumPurchase} bottles
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default PromoPunch;