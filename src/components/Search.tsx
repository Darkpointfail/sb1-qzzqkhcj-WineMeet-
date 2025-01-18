import React, { useState } from 'react';
import { Search as SearchIcon, Wine } from 'lucide-react';
import { SalesRep, Product } from '../types';

interface SearchProps {
  salesReps: SalesRep[];
  products: Product[];
}

export function Search({ salesReps, products }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSalesReps = salesReps.filter(rep => 
    rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.portfolio.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search sales reps, products, or regions..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm && (
        <div className="mt-4 space-y-4">
          {filteredSalesReps.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 text-gray-900">Sales Representatives</h3>
              <div className="space-y-2">
                {filteredSalesReps.map(rep => (
                  <div key={rep.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <img src={rep.image} alt={rep.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-900">{rep.name}</p>
                      <p className="text-sm text-gray-600">{rep.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 text-gray-900">Products</h3>
              <div className="space-y-2">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <Wine className="w-5 h-5 text-wine-700" />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.region}</p>
                    </div>
                    {product.trending && (
                      <span className="ml-auto text-xs bg-wine-100 text-wine-700 px-2 py-1 rounded-full">
                        Trending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}