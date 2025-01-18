import React, { useState, useEffect } from 'react';
import { Calendar } from '../../components/Calendar';
import { CalendarPlus, Search, MapPin, Clock, X, UserCircle, Building2, Navigation } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getMeetings } from '../../lib/api';
import type { Meeting } from '../../types';

interface Shop {
  id: string;
  name: string;
  address: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  image_url?: string;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
  staff_id: string;
  is_available: boolean;
}

// Generate time slots between 10 AM and 6 PM with 30-minute intervals
function generateTimeSlots(): { start: string; end: string }[] {
  const slots: { start: string; end: string }[] = [];
  const startHour = 10;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    // First 30-minute slot
    slots.push({
      start: `${hour.toString().padStart(2, '0')}:00`,
      end: `${hour.toString().padStart(2, '0')}:30`
    });
    // Second 30-minute slot
    slots.push({
      start: `${hour.toString().padStart(2, '0')}:30`,
      end: `${(hour + 1).toString().padStart(2, '0')}:00`
    });
  }
  
  return slots;
}

function Booking() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [suggestedShops, setSuggestedShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch meetings and suggested shops on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [meetingsData, { data: shopsData }] = await Promise.all([
          getMeetings(),
          supabase
            .from('shops')
            .select('id, name, address')
            .order('name')
            .limit(6)
        ]);

        setMeetings(meetingsData);
        if (shopsData) {
          setSuggestedShops(shopsData);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    loadInitialData();
  }, []);

  // Load shops when search query changes
  useEffect(() => {
    const fetchShops = async () => {
      if (searchQuery.length < 2) {
        setShops([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select('id, name, address')
        .or(`name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`)
        .order('name')
        .limit(10);

      if (!error && data) {
        setShops(data);
      }
      setLoading(false);
    };

    fetchShops();
  }, [searchQuery]);

  // Load staff and time slots when shop and date are selected
  useEffect(() => {
    const fetchStaffAndSlots = async () => {
      if (!selectedShop) return;

      const { data: staffData, error: staffError } = await supabase
        .from('shop_staff')
        .select(`
          staff_id,
          profiles (
            id,
            name,
            role,
            image_url
          )
        `)
        .eq('shop_id', selectedShop.id);

      if (!staffError && staffData) {
        setStaff(staffData.map(s => ({
          id: s.profiles.id,
          name: s.profiles.name,
          role: s.profiles.role,
          image_url: s.profiles.image_url
        })));
      }

      // Generate 30-minute time slots
      const availableSlots = generateTimeSlots().map(slot => ({
        start_time: slot.start,
        end_time: slot.end,
        staff_id: staffData?.[0]?.staff_id || '',
        is_available: Math.random() > 0.3 // Simulate availability (70% chance of being available)
      }));

      setTimeSlots(availableSlots);
    };

    fetchStaffAndSlots();
  }, [selectedShop, selectedDate]);

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
    setSearchQuery('');
    setShops([]);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CalendarPlus className="w-6 h-6 text-[#7E003F] mr-2" />
            <h1 className="text-2xl font-semibold">Book Meetings</h1>
          </div>
          <button className="bg-[#7E003F] text-white px-4 py-2 rounded-md hover:bg-[#7E003F]/90 transition-colors">
            New Meeting
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Search and Selection */}
          <div className="space-y-6">
            {/* Shop Search */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search SAQ shops by name or address..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7E003F]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Search Results */}
              {searchQuery.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">
                      Searching...
                    </div>
                  ) : shops.length > 0 ? (
                    shops.map((shop) => (
                      <button
                        key={shop.id}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-start gap-3"
                        onClick={() => handleShopSelect(shop)}
                      >
                        <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium">{shop.name}</p>
                          <p className="text-sm text-gray-500">{shop.address}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No SAQ shops found
                    </div>
                  )}
                </div>
              )}

              {/* Suggested Shops */}
              {!searchQuery && suggestedShops.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-[#7E003F]" />
                    <h2 className="text-sm font-medium text-gray-700">Popular SAQ Shops</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestedShops.map((shop) => (
                      <button
                        key={shop.id}
                        onClick={() => handleShopSelect(shop)}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:border-[#7E003F] hover:bg-[#7E003F]/5 transition-colors text-left"
                      >
                        <Navigation className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">{shop.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{shop.address}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Shop */}
            {selectedShop && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#7E003F] mt-1" />
                    <div>
                      <p className="font-medium">{selectedShop.name}</p>
                      <p className="text-sm text-gray-500">{selectedShop.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedShop(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Staff List */}
            {selectedShop && staff.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Available Staff</h3>
                <div className="space-y-2">
                  {staff.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => setSelectedStaff(person)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border ${
                        selectedStaff?.id === person.id
                          ? 'border-[#7E003F] bg-[#7E003F]/5'
                          : 'hover:border-[#7E003F] hover:bg-[#7E003F]/5'
                      } transition-colors`}
                    >
                      {person.image_url ? (
                        <img
                          src={person.image_url}
                          alt={person.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <UserCircle className="w-8 h-8 text-gray-400" />
                      )}
                      <div className="text-left">
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-gray-500">{person.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Calendar and Time Slots */}
          <div className="space-y-6">
            <Calendar
              meetings={meetings}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />

            {selectedShop && timeSlots.length > 0 && (
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-[#7E003F]" />
                  <h2 className="text-lg font-semibold">Available Time Slots</h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots
                    .filter(slot => slot.is_available)
                    .map((slot, index) => (
                      <button
                        key={index}
                        className="p-3 text-left border rounded-lg hover:bg-gray-50"
                      >
                        <p className="font-medium">
                          {slot.start_time} - {slot.end_time}
                        </p>
                        <p className="text-sm text-gray-500">30 minutes</p>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Booking;