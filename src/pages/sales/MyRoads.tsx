import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthContext';

interface Route {
  id: string;
  name: string;
  color: string;
  created_at: string;
  shops: {
    name: string;
    address: string;
    sequence_order: number;
  }[];
}

const EXAMPLE_ROUTES = [
  {
    name: "Montreal Downtown Tour",
    color: "#FF6B6B",
    shops: [
      { name: "SAQ Sélection Place Versailles", address: "7275 Rue Sherbrooke Est, Montréal" },
      { name: "SAQ Classique Atwater", address: "2681 Rue Notre-Dame Ouest, Montréal" },
      { name: "SAQ Express Jean-Talon", address: "440 Rue Jean-Talon Est, Montréal" }
    ]
  },
  {
    name: "Quebec City Circuit",
    color: "#4ECDC4",
    shops: [
      { name: "SAQ Sélection Lebourgneuf", address: "1500 Boulevard Lebourgneuf, Québec" },
      { name: "SAQ Classique Place Sainte-Foy", address: "2450 Boulevard Laurier, Québec" }
    ]
  },
  {
    name: "Laval Express Route",
    color: "#45B7D1",
    shops: [
      { name: "SAQ Dépôt Laval", address: "1950 Boulevard Le Corbusier, Laval" },
      { name: "SAQ Sélection Centropolis", address: "1799 Avenue Pierre-Péladeau, Laval" }
    ]
  }
];

export default function MyRoads() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRoutes = async () => {
      // First, try to fetch existing routes
      const { data: existingRoutes, error: routesError } = await supabase
        .from('routes')
        .select(`
          id,
          name,
          color,
          created_at,
          route_shops (
            sequence_order,
            shops (
              name,
              address
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (!routesError && existingRoutes && existingRoutes.length === 0 && user) {
        // If no routes exist, create example routes
        for (const example of EXAMPLE_ROUTES) {
          // Create route
          const { data: route, error: routeError } = await supabase
            .from('routes')
            .insert({
              name: example.name,
              color: example.color,
              sales_rep_id: user.id
            })
            .select()
            .single();

          if (!routeError && route) {
            // Get shop IDs
            const { data: shops } = await supabase
              .from('shops')
              .select('id, name')
              .in('name', example.shops.map(s => s.name));

            if (shops && shops.length > 0) {
              // Create route shops
              await supabase
                .from('route_shops')
                .insert(
                  example.shops.map((shop, index) => ({
                    route_id: route.id,
                    shop_id: shops.find(s => s.name === shop.name)?.id,
                    sequence_order: index + 1
                  }))
                );
            }
          }
        }

        // Fetch the newly created routes
        const { data: newRoutes } = await supabase
          .from('routes')
          .select(`
            id,
            name,
            color,
            created_at,
            route_shops (
              sequence_order,
              shops (
                name,
                address
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (newRoutes) {
          const formattedRoutes = newRoutes.map(route => ({
            id: route.id,
            name: route.name,
            color: route.color,
            created_at: route.created_at,
            shops: route.route_shops
              .sort((a, b) => a.sequence_order - b.sequence_order)
              .map(rs => ({
                name: rs.shops.name,
                address: rs.shops.address,
                sequence_order: rs.sequence_order
              }))
          }));
          setRoutes(formattedRoutes);
        }
      } else if (existingRoutes) {
        const formattedRoutes = existingRoutes.map(route => ({
          id: route.id,
          name: route.name,
          color: route.color,
          created_at: route.created_at,
          shops: route.route_shops
            .sort((a, b) => a.sequence_order - b.sequence_order)
            .map(rs => ({
              name: rs.shops.name,
              address: rs.shops.address,
              sequence_order: rs.sequence_order
            }))
        }));
        setRoutes(formattedRoutes);
      }
      setLoading(false);
    };

    fetchRoutes();
  }, [user]);

  const handleDeleteRoute = async (routeId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this route?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', routeId);

    if (!error) {
      setRoutes(routes.filter(route => route.id !== routeId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine-700 mx-auto"></div>
          <p className="mt-4 text-wine-700">Loading routes...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Navigation className="w-6 h-6 text-wine-700" />
            <h1 className="text-2xl font-semibold text-wine-700">My Routes</h1>
          </div>
          <span className="text-sm text-wine-600">
            {routes.length} {routes.length === 1 ? 'route' : 'routes'} created
          </span>
        </div>

        {routes.length === 0 ? (
          <div className="text-center py-12">
            <Navigation className="w-12 h-12 text-wine-300 mx-auto mb-4" />
            <p className="text-wine-600">No routes created yet</p>
            <p className="text-wine-500 text-sm mt-2">
              Create your first route in the Maps section
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {routes.map(route => (
              <div
                key={route.id}
                className="border border-wine-100 rounded-lg p-4 hover:border-wine-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: route.color }}
                    />
                    <h3 className="text-lg font-medium text-wine-700">
                      {route.name}
                    </h3>
                    <span className="text-sm text-wine-600">
                      {route.shops.length} stops
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteRoute(route.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete route"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {route.shops.map((shop, index) => (
                    <div key={index} className="flex items-start group pl-4">
                      <div className="w-6 h-6 rounded-full bg-wine-100 text-wine-700 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                        {shop.sequence_order}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-wine-600 mr-1" />
                          <p className="font-medium text-wine-700">{shop.name}</p>
                        </div>
                        <p className="text-wine-600 text-sm mt-0.5">{shop.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}