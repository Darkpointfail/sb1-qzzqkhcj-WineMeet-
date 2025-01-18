import React, { useState, useEffect } from 'react';
import { UserCircle, Mail, Phone, Building2, Map, Save } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../lib/supabase';

interface Profile {
  name: string;
  email: string;
  phone?: string;
  company: string;
  role: string;
  image_url?: string;
}

export default function Account() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
      setLoading(false);
    }

    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          phone: profile.phone,
          company: profile.company,
          role: profile.role
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine-700 mx-auto"></div>
          <p className="mt-4 text-wine-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {profile.image_url ? (
              <img
                src={profile.image_url}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-16 h-16 text-wine-700" />
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-700 focus:border-wine-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-700 focus:border-wine-700"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                My Store
              </label>
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={profile.company}
                  onChange={e => setProfile({ ...profile, company: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-700 focus:border-wine-700"
                  placeholder="e.g., SAQ Dépôt Marché Central"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                My Role
              </label>
              <div className="flex items-center">
                <Map className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={profile.role}
                  onChange={e => setProfile({ ...profile, role: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-700 focus:border-wine-700"
                  placeholder="e.g., Wine Advisor"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wine-700 hover:bg-wine-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wine-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}