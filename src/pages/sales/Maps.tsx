import React, { useState, useEffect } from 'react';
import { Map as MapIcon } from 'lucide-react';
import { MapComponent } from '../../components/Map';
import { QuickRouteBuilder } from '../../components/QuickRouteBuilder';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthContext';

interface Shop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

function Maps() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<Shop[]>([]);
  const { user } = useAuth();

  const fetchData = async () => {
    const { data } = await supabase
      .from('shops')
      .select('*')
      .order('name');
    
    if (data) {
      setShops(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <MapIcon className="w-6 h-6 text-wine-700 mr-2" />
          <h1 className="text-2xl font-semibold text-wine-700">My Routes</h1>
        </div>
        
        <div className="space-y-6">
          {/* Map */}
          <MapComponent shops={shops} selectedShops={selectedShops} />

          {/* Quick Route Builder */}
          <div className="mt-8">
            <QuickRouteBuilder
              shops={shops}
              onRouteCreated={fetchData}
              userId={user?.id || ''}
              onShopsSelected={setSelectedShops}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Maps;