import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Wine, Beaker, Map, Calendar as CalendarIcon, UserCircle, LogOut, Clock, BarChart } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Testing from './pages/Testing';
import PromoPunch from './pages/PromoPunch';
import SalesRepDashboard from './pages/sales/Dashboard';
import SalesRepMaps from './pages/sales/Maps';
import SalesRepBooking from './pages/sales/Booking';
import MyRoads from './pages/sales/MyRoads';
import Availability from './pages/Availability';
import Analytics from './pages/Analytics';
import Account from './pages/Account';
import Login from './pages/Login';
import { useAuth } from './components/AuthContext';
import { HeaderSearch } from './components/HeaderSearch';
import { RoutesList } from './components/RoutesList';
import { PrivateRoute } from './components/PrivateRoute';

function AdminNavigation() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  let timeoutId: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setShowDropdown(false);
    }, 300);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center mr-8">
              <Wine className="w-8 h-8 text-wine-700" />
              <span className="ml-2 text-xl font-semibold text-gray-900">WineMeet Manager</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/testing" className="nav-link">
                <Beaker className="nav-icon" />
                My Testing
              </Link>
              <Link to="/promopunch" className="nav-link">
                <CalendarIcon className="nav-icon" />
                PromoPunch
              </Link>
              <Link to="/availability" className="nav-link">
                <Clock className="nav-icon" />
                My Availability
              </Link>
              <Link to="/analytics" className="nav-link">
                <BarChart className="nav-icon" />
                Analytics
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <HeaderSearch />
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center space-x-3 text-gray-700 hover:text-wine-600 transition-colors">
                <span className="text-sm font-medium">SAQ Staff</span>
                <div className="relative">
                  <UserCircle className="w-8 h-8" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserCircle className="nav-icon" />
                    My Account
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="nav-icon" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function SalesRepNavigation() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  let timeoutId: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setShowDropdown(false);
    }, 300);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center mr-8">
              <Wine className="w-8 h-8 text-wine-700" />
              <span className="ml-2 text-xl font-semibold text-gray-900">WineMeet Sales</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/maps" className="nav-link">
                <Map className="nav-icon" />
                Maps
              </Link>
              <Link to="/booking" className="nav-link">
                <CalendarIcon className="nav-icon" />
                Booking
              </Link>
              <Link to="/testing" className="nav-link">
                <Beaker className="nav-icon" />
                My Testing
              </Link>
              <Link to="/analytics" className="nav-link">
                <BarChart className="nav-icon" />
                Analytics
              </Link>
              <RoutesList />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <HeaderSearch />
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center space-x-3 text-gray-700 hover:text-wine-600 transition-colors">
                <span className="text-sm font-medium">Sales Rep</span>
                <div className="relative">
                  <UserCircle className="w-8 h-8" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserCircle className="nav-icon" />
                    My Account
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="nav-icon" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function App() {
  const location = useLocation();
  const { userRole } = useAuth();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gray-100">
      {!isLoginPage && (
        userRole === 'admin' ? <AdminNavigation /> : <SalesRepNavigation />
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              {userRole === 'admin' ? <Dashboard /> : <SalesRepDashboard />}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/testing" 
          element={
            <PrivateRoute>
              <Testing />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/promopunch" 
          element={
            <PrivateRoute>
              {userRole === 'admin' && <PromoPunch />}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/availability" 
          element={
            <PrivateRoute>
              {userRole === 'admin' && <Availability />}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/account" 
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          } 
        />
        
        {/* Sales Rep Routes */}
        <Route 
          path="/maps" 
          element={
            <PrivateRoute>
              {userRole === 'sales_rep' && <SalesRepMaps />}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/booking" 
          element={
            <PrivateRoute>
              {userRole === 'sales_rep' && <SalesRepBooking />}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/my-roads" 
          element={
            <PrivateRoute>
              {userRole === 'sales_rep' && <MyRoads />}
            </PrivateRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;