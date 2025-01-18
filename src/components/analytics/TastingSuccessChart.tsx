import React from 'react';
import { Wine, ThumbsUp, Star } from 'lucide-react';

interface TastingStats {
  totalTastings: number;
  successfulTastings: number;
  averageRating: number;
}

export function TastingSuccessChart({ stats }: { stats: TastingStats }) {
  const successRate = (stats.successfulTastings / stats.totalTastings) * 100;

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Wine className="w-5 h-5 text-wine-700" />
        <h3 className="text-lg font-semibold text-gray-900">Tasting Success Rate</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-wine-50 rounded-lg">
          <Wine className="w-8 h-8 text-wine-700 mx-auto mb-2" />
          <div className="text-2xl font-bold text-wine-700">{stats.totalTastings}</div>
          <div className="text-sm text-wine-600">Total Tastings</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <ThumbsUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{successRate.toFixed(1)}%</div>
          <div className="text-sm text-green-600">Success Rate</div>
        </div>

        <div className="text-center p-4 bg-amber-50 rounded-lg">
          <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-600">{stats.averageRating.toFixed(1)}</div>
          <div className="text-sm text-amber-600">Avg. Rating</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-wine-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}