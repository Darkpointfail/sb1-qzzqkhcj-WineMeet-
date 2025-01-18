import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from 'lucide-react';

export function RoutesList() {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate('/my-roads')}
      className="nav-link"
    >
      <Navigation className="nav-icon" />
      My Roads
    </button>
  );
}