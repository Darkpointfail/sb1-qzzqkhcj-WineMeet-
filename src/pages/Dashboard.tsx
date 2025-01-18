import React, { useState, useEffect } from 'react';
import { Calendar } from '../components/Calendar';
import { DailyRecap } from '../components/DailyRecap';
import { TrendingUp, Clock, Users, Wine } from 'lucide-react';
import { getMeetings, getSalesReps, getProducts } from '../lib/api';
import type { Meeting, SalesRep, Product } from '../types';

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [meetingsData, salesRepsData, productsData] = await Promise.all([
          getMeetings(),
          getSalesReps(),
          getProducts()
        ]);
        setMeetings(meetingsData);
        setSalesReps(salesRepsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine-700 mx-auto"></div>
          <p className="mt-4 text-wine-700">Loading...</p>
        </div>
      </div>
    );
  }

  const upcomingMeetings = meetings.filter(meeting => new Date(meeting.date) > new Date()).length;
  const totalSalesReps = salesReps.length;
  const trendingProducts = products.filter(product => product.trending).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stats-card">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-wine-700" />
            <div className="ml-4">
              <p className="text-sm text-gray-900">Upcoming Meetings</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingMeetings}</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-wine-700" />
            <div className="ml-4">
              <p className="text-sm text-gray-900">Sales Representatives</p>
              <p className="text-2xl font-semibold text-gray-900">{totalSalesReps}</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-wine-700" />
            <div className="ml-4">
              <p className="text-sm text-gray-900">Trending Products</p>
              <p className="text-2xl font-semibold text-gray-900">{trendingProducts}</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <Wine className="w-8 h-8 text-wine-700" />
            <div className="ml-4">
              <p className="text-sm text-gray-900">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Calendar */}
        <div className="glass-card p-4">
          <Calendar 
            meetings={meetings} 
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>

        {/* Daily Recap */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-wine-700" />
            <h2 className="text-lg font-semibold text-gray-900">Daily Meetings</h2>
          </div>
          <div className="h-[360px] overflow-y-auto custom-scrollbar pr-2">
            <DailyRecap 
              meetings={meetings} 
              salesReps={salesReps} 
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>

      {/* Trending Products */}
      <div className="glass-card p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products
            .filter(product => product.trending)
            .map(product => (
              <div key={product.id} className="hover-card border rounded-lg p-4">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.region}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {product.sales.toLocaleString()} bottles sold
                </p>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;