import React, { useState } from 'react';
import { Map, Building2, Plus, Save, X, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Shop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface QuickRouteBuilderProps {
  shops: Shop[];
  onRouteCreated: () => void;
  userId: string;
  onShopsSelected: (shops: Shop[]) => void;
}

const ROUTE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B6B6B', '#E9967A', '#66CDAA', '#DEB887'
];

export function QuickRouteBuilder({ shops, onRouteCreated, userId, onShopsSelected }: QuickRouteBuilderProps) {
  const [selectedShops, setSelectedShops] = useState<Shop[]>([]);
  const [routeName, setRouteName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleShopSelect = (shop: Shop) => {
    if (selectedShops.length >= 5) {
      setError('Maximum 5 shops allowed per quick route');
      return;
    }
    if (selectedShops.find(s => s.id === shop.id)) {
      setError('This shop is already in your route');
      return;
    }
    const newSelectedShops = [...selectedShops, shop];
    setSelectedShops(newSelectedShops);
    onShopsSelected(newSelectedShops);
    setError('');
  };

  const handleRemoveShop = (shopId: string) => {
    const newSelectedShops = selectedShops.filter(shop => shop.id !== shopId);
    setSelectedShops(newSelectedShops);
    onShopsSelected(newSelectedShops);
    setError('');
  };

  const handleSaveRoute = async () => {
    if (!routeName.trim()) {
      setError('Please enter a route name');
      return;
    }
    if (selectedShops.length < 2) {
      setError('Please select at least 2 shops for the route');
      return;
    }

    setSaving(true);
    try {
      // Create new route
      const { data: route, error: routeError } = await supabase
        .from('routes')
        .insert({
          name: routeName,
          sales_rep_id: userId,
          color: ROUTE_COLORS[Math.floor(Math.random() * ROUTE_COLORS.length)]
        })
        .select()
        .single();

      if (routeError) throw routeError;

      // Add shops to route with sequence order
      const { error: shopsError } = await supabase
        .from('route_shops')
        .insert(
          selectedShops.map((shop, index) => ({
            route_id: route.id,
            shop_id: shop.id,
            sequence_order: index + 1
          }))
        );

      if (shopsError) throw shopsError;

      // Reset form
      setSelectedShops([]);
      setRouteName('');
      onShopsSelected([]);
      onRouteCreated();
    } catch (error) {
      console.error('Error saving route:', error);
      setError('Failed to save route. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-wine-700" />
          <h2 className="text-lg font-semibold text-black">Quick Route Builder</h2>
        </div>
        <button
          onClick={handleSaveRoute}
          disabled={saving || selectedShops.length < 2 || !routeName.trim()}
          className="primary-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Route'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="routeName" className="block text-sm font-medium text-black mb-1">
          Route Name
        </label>
        <input
          type="text"
          id="routeName"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          placeholder="Enter route name..."
          className="search-input"
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Available Shops */}
          <div>
            <h3 className="text-sm font-medium text-black mb-2">Available SAQ Locations</h3>
            <div className="border rounded-lg divide-y max-h-80 overflow-y-auto custom-scrollbar">
              {shops
                .filter(shop => !selectedShops.find(s => s.id === shop.id))
                .map(shop => (
                  <button
                    key={shop.id}
                    onClick={() => handleShopSelect(shop)}
                    className="w-full p-3 text-left hover:bg-wine-50 flex items-start gap-3"
                  >
                    <Plus className="w-5 h-5 text-wine-700 mt-1" />
                    <div>
                      <p className="font-medium text-black">{shop.name}</p>
                      <p className="text-sm text-gray-500">{shop.address}</p>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Selected Shops */}
          <div>
            <h3 className="text-sm font-medium text-black mb-2">Selected Locations</h3>
            <div className="border rounded-lg divide-y max-h-80 overflow-y-auto custom-scrollbar">
              {selectedShops.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No locations selected
                </div>
              ) : (
                selectedShops.map((shop, index) => (
                  <div
                    key={shop.id}
                    className="p-3 flex items-start justify-between group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-wine-100 text-wine-700 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-black">{shop.name}</p>
                        <p className="text-sm text-gray-500">{shop.address}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveShop(shop.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}