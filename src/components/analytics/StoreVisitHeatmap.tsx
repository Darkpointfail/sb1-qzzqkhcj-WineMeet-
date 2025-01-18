import React from 'react';
import { MapPin } from 'lucide-react';

interface VisitData {
  store: string;
  visits: number;
  lastVisit: string;
  nextScheduled?: string;
}

export function StoreVisitHeatmap({ visits }: { visits: VisitData[] }) {
  const maxVisits = Math.max(...visits.map(v => v.visits));

  const getHeatmapColor = (visits: number) => {
    const intensity = (visits / maxVisits) * 100;
    return `rgba(126, 0, 63, ${intensity * 0.01})`;
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-wine-700" />
        <h3 className="text-lg font-semibold text-gray-900">Store Visit Frequency</h3>
      </div>

      <div className="space-y-4">
        {visits.map((visit, index) => (
          <div
            key={index}
            className="p-4 rounded-lg"
            style={{ backgroundColor: getHeatmapColor(visit.visits) }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{visit.store}</h4>
                <p className="text-sm text-gray-600">
                  Last visit: {visit.lastVisit}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-wine-700">
                  {visit.visits}
                </div>
                <div className="text-sm text-gray-600">visits</div>
              </div>
            </div>
            {visit.nextScheduled && (
              <div className="mt-2 text-sm">
                <span className="text-wine-600">
                  Next scheduled: {visit.nextScheduled}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}