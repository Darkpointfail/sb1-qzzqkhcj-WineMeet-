import React from 'react';
import { Clock } from 'lucide-react';
import { AvailabilityManager } from '../components/AvailabilityManager';

export default function Availability() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-wine-700" />
          <h1 className="text-2xl font-semibold text-wine-700">My Availability</h1>
        </div>
        <p className="mt-2 text-wine-600">
          Set your available time slots for wine tastings and meetings
        </p>
      </div>

      <AvailabilityManager />
    </main>
  );
}