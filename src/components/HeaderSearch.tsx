import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, Building2, Wine, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SearchResult {
  id: string;
  name: string;
  type: 'employee' | 'product';
  role?: string;
  company?: string;
  region?: string;
  image_url?: string;
}

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const [employeesResponse, productsResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, name, role, company, image_url')
            .or(`name.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
            .limit(5),
          supabase
            .from('products')
            .select('id, name, region')
            .or(`name.ilike.%${searchTerm}%,region.ilike.%${searchTerm}%`)
            .limit(5)
        ]);

        const employees = (employeesResponse.data || []).map(emp => ({
          ...emp,
          type: 'employee' as const
        }));

        const products = (productsResponse.data || []).map(prod => ({
          ...prod,
          type: 'product' as const
        }));

        setResults([...employees, ...products]);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search employees or products..."
          className="w-64 pl-10 pr-4 py-2 bg-white/90 backdrop-blur-sm border border-wine-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-700/20 focus:border-wine-700 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-wine-600" />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setResults([]);
            }}
            className="absolute right-3 top-2.5 text-wine-600 hover:text-wine-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && (searchTerm.length >= 2 || results.length > 0) && (
        <div className="absolute top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-wine-100 py-2 z-50">
          {loading ? (
            <div className="px-4 py-3 text-wine-600">Searching...</div>
          ) : results.length > 0 ? (
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {results.map(result => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="px-4 py-3 hover:bg-wine-50 flex items-start gap-3"
                >
                  {result.type === 'employee' ? (
                    <>
                      {result.image_url ? (
                        <img
                          src={result.image_url}
                          alt={result.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-10 h-10 text-wine-600" />
                      )}
                      <div>
                        <p className="font-medium text-wine-700">{result.name}</p>
                        <p className="text-sm text-wine-600">
                          {result.role} at {result.company || 'SAQ'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Wine className="w-10 h-10 text-wine-600" />
                      <div>
                        <p className="font-medium text-wine-700">{result.name}</p>
                        <p className="text-sm text-wine-600">{result.region}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="px-4 py-3 text-wine-600">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}