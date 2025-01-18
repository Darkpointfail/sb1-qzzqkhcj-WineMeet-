import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize mapbox with a temporary token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNsYjB2a3RldzAyYnEzcW8zZzBvNDEwbWsifQ.hJHtbfvoEHZ8NfXU-5grXA';

interface MapProps {
  shops: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }>;
  selectedShops?: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }>;
}

export function MapComponent({ shops, selectedShops = [] }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Use streets style instead of light
      center: [-73.5673, 45.5017], // Montreal coordinates
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Clean up on unmount
    return () => map.current?.remove();
  }, []);

  // Add markers when shops change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Add markers for all shops
    shops.forEach(shop => {
      const isSelected = selectedShops.some(selected => selected.id === shop.id);
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isSelected ? '%237E003F' : '%23666666'}" stroke="white" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>')`;
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      // Create popup with more detailed information
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="padding: 8px;">
            <strong style="color: #7E003F;">${shop.name}</strong>
            <p style="margin: 4px 0 0; font-size: 12px; color: #666;">
              ${isSelected ? 'Selected Location' : 'Available Location'}
            </p>
          </div>
        `);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([shop.longitude, shop.latitude])
        .setPopup(popup)
        .addTo(map.current);
    });

    // Fit bounds to show all markers with padding
    if (shops.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      shops.forEach(shop => {
        bounds.extend([shop.longitude, shop.latitude]);
      });
      map.current.fitBounds(bounds, { 
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000
      });
    }
  }, [shops, selectedShops]);

  return (
    <div className="relative">
      <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow-md" />
      {shops.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">Loading map...</p>
        </div>
      )}
    </div>
  );
}