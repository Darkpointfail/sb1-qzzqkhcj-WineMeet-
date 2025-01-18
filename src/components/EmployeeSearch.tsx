import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Mail, Phone, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Employee {
  id: string;
  name: string;
  email?: string;
  role: string;
  company: string;
  image_url?: string;
}

export function EmployeeSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setEmployees([]);
      return;
    }

    const fetchEmployees = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%`)
        .order('name');

      if (!error && data) {
        setEmployees(data);
      }
      setLoading(false);
    };

    const timer = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <SearchIcon className="w-5 h-5 text-[#7E003F]" />
        <h2 className="text-lg font-semibold">Employee Directory</h2>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search employees by name, role, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7E003F] focus:border-transparent"
        />
        <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Searching...</div>
        ) : searchTerm.length >= 2 ? (
          employees.length > 0 ? (
            <div className="space-y-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#7E003F] transition-colors"
                >
                  <img
                    src={employee.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{employee.name}</h3>
                        <p className="text-sm text-gray-500">{employee.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {employee.email && (
                          <a
                            href={`mailto:${employee.email}`}
                            className="p-2 text-gray-500 hover:text-[#7E003F] rounded-full hover:bg-[#7E003F]/10 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href="tel:+15145550123"
                          className="p-2 text-gray-500 hover:text-[#7E003F] rounded-full hover:bg-[#7E003F]/10 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Building2 className="w-4 h-4 mr-1" />
                      {employee.company || 'SAQ'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No employees found
            </div>
          )
        ) : searchTerm.length === 1 ? (
          <div className="text-center py-4 text-gray-500">
            Type at least 2 characters to search
          </div>
        ) : null}
      </div>
    </div>
  );
}