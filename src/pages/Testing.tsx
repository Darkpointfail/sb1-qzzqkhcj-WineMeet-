import React, { useState } from 'react';
import { format } from 'date-fns';
import { Wine, Star, Archive, TrendingUp, BarChart } from 'lucide-react';
import { meetings, salesReps, products } from '../data';
import type { Meeting } from '../types';

function Testing() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const now = new Date();
  const upcomingTastings = meetings.filter(m => m.date > now);
  const pastTastings = meetings.filter(m => m.date <= now);

  const getProductsForMeeting = (meeting: Meeting) => {
    return meeting.products.map(id => products.find(p => p.id === id)).filter(Boolean);
  };

  const getSalesRep = (id: string) => {
    return salesReps.find(rep => rep.id === id);
  };

  const calculateStats = () => {
    const totalTastings = pastTastings.length;
    const averageRating = 4.2; // This would come from actual tasting notes
    const achievedGoals = 85; // This would be calculated from actual data
    
    return { totalTastings, averageRating, achievedGoals };
  };

  const stats = calculateStats();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Wine className="w-8 h-8 text-[#7E003F]" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Tastings</p>
              <p className="text-2xl font-semibold">{stats.totalTastings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-[#7E003F]" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-semibold">{stats.averageRating}/5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-[#7E003F]" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Goals Achieved</p>
              <p className="text-2xl font-semibold">{stats.achievedGoals}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-[#7E003F] text-[#7E003F]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Wine className="w-5 h-5 mr-2" />
              Upcoming Tastings
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-[#7E003F] text-[#7E003F]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Archive className="w-5 h-5 mr-2" />
              Past Tastings
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {(activeTab === 'upcoming' ? upcomingTastings : pastTastings).map(meeting => {
              const salesRep = getSalesRep(meeting.salesRepId);
              const meetingProducts = getProductsForMeeting(meeting);
              
              return (
                <div key={meeting.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img
                        src={salesRep?.image}
                        alt={salesRep?.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{meeting.title}</h3>
                        <p className="text-sm text-gray-500">
                          with {salesRep?.name} • {format(meeting.date, 'PPp')}
                        </p>
                        {meeting.notes && (
                          <p className="text-sm text-gray-600 mt-2">{meeting.notes}</p>
                        )}
                      </div>
                    </div>
                    {activeTab === 'past' && (
                      <button className="flex items-center text-[#7E003F] hover:text-[#7E003F]/80">
                        <BarChart className="w-5 h-5 mr-1" />
                        View Report
                      </button>
                    )}
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Products to Taste:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {meetingProducts.map(product => product && (
                        <div key={product.id} className="flex items-center justify-between bg-white p-4 rounded-lg">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.vintage} • {product.region}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Stock</p>
                            <p className="text-sm text-gray-500">{product.stock} bottles</p>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default Testing;