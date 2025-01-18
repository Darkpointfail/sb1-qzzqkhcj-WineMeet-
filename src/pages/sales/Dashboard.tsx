import React, { useState, useEffect } from 'react';
import { Calendar } from '../../components/Calendar';
import { DailyRecap } from '../../components/DailyRecap';
import { Clock, Calendar as CalendarIcon, Wine, MapPin, TrendingUp } from 'lucide-react';
import { getMeetings, getSalesReps, getProducts } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthContext';
import type { Meeting, SalesRep, Product } from '../../types';

function SalesRepDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        const [meetingsData, salesRepsData] = await Promise.all([
          getMeetings(),
          getSalesReps()
        ]);

        // Get the current sales rep's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('portfolio')
          .eq('id', user?.id)
          .single();

        // Get trending products for the sales rep's portfolio
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .in('region', profile?.portfolio || [])
          .eq('trending', true)
          .order('sales', { ascending: false });

        setMeetings(meetingsData);
        setSalesReps(salesRepsData);
        setTrendingProducts(products || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Calculate statistics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    meetingDate.setHours(0, 0, 0, 0);
    return meetingDate.getTime() === today.getTime();
  }).length;

  const upcomingMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    return meetingDate > today;
  }).length;

  const remainingAppointments = todayMeetings + upcomingMeetings;

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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stats-card">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-wine-700" />
            <div className="ml-4">
              <p className="text-sm text-gray-900">Today's Meetings</p>
              <p className="text-2xl font-semibold text-gray-900">{todayMeetings}</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <CalendarIcon className="w-8 h-8 text-wine-700" />
            <div className="ml-4">
              <p className="text-sm text-gray-900">Upcoming Meetings</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingMeetings}</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <Wine className="w-8 h-8 text-wine-700" />
            <div className="ml-4">
              <p className="text-sm text-gray-900">Remaining Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{remainingAppointments}</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-wine-700" />
            <div className="ml-4">
              <p className="text-sm text-gray-900">Assigned Locations</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
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

      {/* Trending Products in Portfolio */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-wine-700" />
          <h2 className="text-lg font-semibold text-gray-900">Trending Products in Your Portfolio</h2>
        </div>
        {trendingProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-wine-200 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.region}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {product.vintage && `${product.vintage} • `}{product.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Sales</div>
                    <div className="text-lg font-semibold text-wine-700">
                      {product.sales.toLocaleString()}
                    </div>
                  </div>
                </div>
                {product.stock !== undefined && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Current Stock</span>
                      <span className="font-medium text-gray-900">{product.stock} bottles</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Wine className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No trending products in your portfolio at the moment</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default SalesRepDashboard;