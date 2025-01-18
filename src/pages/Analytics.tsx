import React, { useState, useEffect } from 'react';
import { BarChart } from 'lucide-react';
import { WinePopularityChart } from '../components/analytics/WinePopularityChart';
import { StoreVisitHeatmap } from '../components/analytics/StoreVisitHeatmap';
import { CategoryTrends } from '../components/analytics/CategoryTrends';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';

export default function Analytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [popularWines, setPopularWines] = useState([]);
  const [storeVisits, setStoreVisits] = useState([]);
  const [categoryTrends, setCategoryTrends] = useState([]);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user) return;

      try {
        // Fetch popular wines
        const { data: wines } = await supabase
          .from('products')
          .select('*')
          .eq('trending', true)
          .limit(5);

        if (wines) {
          setPopularWines(wines.map(wine => ({
            name: wine.name,
            sales: wine.sales,
            trend: Math.floor(Math.random() * 30) - 10,
            region: wine.region
          })));

          // Group wines by category for trends
          const categories = Array.from(new Set(wines.map(w => w.type)));
          const trends = categories.map(category => {
            const categoryWines = wines.filter(w => w.type === category);
            return {
              category,
              sales: categoryWines.reduce((sum, w) => sum + w.sales, 0),
              trend: Math.floor(Math.random() * 40) - 20,
              products: categoryWines.map(w => ({
                id: w.id,
                name: w.name,
                sales: w.sales,
                trend: Math.floor(Math.random() * 30) - 10,
                stock: w.stock || 0,
                vintage: w.vintage
              }))
            };
          });
          setCategoryTrends(trends);
        }

        // Fetch store visits
        const { data: visits } = await supabase
          .from('visits')
          .select('shop_id, visit_date')
          .eq('sales_rep_id', user.id);

        if (visits) {
          const visitCounts = {};
          visits.forEach(visit => {
            visitCounts[visit.shop_id] = (visitCounts[visit.shop_id] || 0) + 1;
          });

          const { data: shops } = await supabase
            .from('shops')
            .select('id, name')
            .in('id', Object.keys(visitCounts));

          if (shops) {
            setStoreVisits(
              shops.map(shop => ({
                store: shop.name,
                visits: visitCounts[shop.id],
                lastVisit: '2024-03-15',
                nextScheduled: '2024-03-22'
              }))
            );
          }
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine-700 mx-auto"></div>
          <p className="mt-4 text-wine-700">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <BarChart className="w-8 h-8 text-wine-700" />
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <CategoryTrends trends={categoryTrends} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WinePopularityChart wines={popularWines} />
          <StoreVisitHeatmap visits={storeVisits} />
        </div>
      </div>
    </main>
  );
}