import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Check, X } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const TIME_SLOTS = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' }
];

export function AvailabilityManager() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    if (!user) return;

    const fetchAvailabilities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff_availability')
        .select('*')
        .eq('staff_id', user.id)
        .gte('date', format(new Date(), 'yyyy-MM-dd'))
        .lte('date', format(addDays(new Date(), 13), 'yyyy-MM-dd'))
        .order('date')
        .order('start_time');

      if (!error && data) {
        setAvailabilities(data);
      }
      setLoading(false);
    };

    fetchAvailabilities();
  }, [user]);

  const toggleAvailability = async (date: Date, start: string, end: string) => {
    if (!user) return;

    const formattedDate = format(date, 'yyyy-MM-dd');
    const existingSlot = availabilities.find(
      slot => slot.date === formattedDate && slot.start_time === start && slot.end_time === end
    );

    if (existingSlot) {
      // Update existing slot
      const { error } = await supabase
        .from('staff_availability')
        .update({ is_available: !existingSlot.is_available })
        .eq('id', existingSlot.id);

      if (!error) {
        setAvailabilities(availabilities.map(slot =>
          slot.id === existingSlot.id
            ? { ...slot, is_available: !slot.is_available }
            : slot
        ));
      }
    } else {
      // Create new slot
      const { data, error } = await supabase
        .from('staff_availability')
        .insert({
          staff_id: user.id,
          date: formattedDate,
          start_time: start,
          end_time: end,
          is_available: true
        })
        .select()
        .single();

      if (!error && data) {
        setAvailabilities([...availabilities, data]);
      }
    }
  };

  const getSlotStatus = (date: Date, start: string, end: string) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const slot = availabilities.find(
      slot => slot.date === formattedDate && slot.start_time === start && slot.end_time === end
    );
    return slot?.is_available ?? false;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wine-700 mx-auto"></div>
        <p className="mt-2 text-wine-600">Loading availability...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-wine-700" />
        <h2 className="text-lg font-semibold text-wine-700">My Availability</h2>
      </div>

      <div className="space-y-6">
        {/* Date selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {dates.map(date => (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-colors ${
                isSameDay(date, selectedDate)
                  ? 'bg-wine-700 text-white border-wine-700'
                  : 'border-wine-100 hover:border-wine-200'
              }`}
            >
              <div className="text-sm font-medium">
                {format(date, 'EEE')}
              </div>
              <div className={`text-lg ${isSameDay(date, selectedDate) ? 'text-white' : 'text-wine-700'}`}>
                {format(date, 'd')}
              </div>
            </button>
          ))}
        </div>

        {/* Time slots */}
        <div className="space-y-2">
          {TIME_SLOTS.map(({ start, end }) => {
            const isAvailable = getSlotStatus(selectedDate, start, end);
            return (
              <button
                key={`${start}-${end}`}
                onClick={() => toggleAvailability(selectedDate, start, end)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                  isAvailable
                    ? 'bg-wine-50 border-wine-200 hover:bg-wine-100'
                    : 'border-gray-200 hover:border-wine-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${isAvailable ? 'text-wine-700' : 'text-gray-400'}`} />
                  <span className={`font-medium ${isAvailable ? 'text-wine-700' : 'text-gray-600'}`}>
                    {start} - {end}
                  </span>
                </div>
                {isAvailable ? (
                  <div className="flex items-center gap-2 text-wine-700">
                    <Check className="w-5 h-5" />
                    <span className="text-sm">Available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <X className="w-5 h-5" />
                    <span className="text-sm">Unavailable</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}