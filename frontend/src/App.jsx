import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPortal from './portals/auth/LoginPortal';
import VendorPortal from './portals/vendor/VendorPortal';
import AdvertiserPortal from './portals/advertiser/AdvertiserPortal';
import AdminPortal from './portals/admin/AdminPortal';

export default function App() {
  // 1. New state to control the landing page visibility
  const [showLanding, setShowLanding] = useState(true);
  
  // Existing auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [portalRole, setPortalRole] = useState(null); // 'vendor', 'advertiser', 'admin'

  const handleLogin = (email, role) => {
    setIsLoggedIn(true);
    setPortalRole(role);
    setCurrentUser({ email, role });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPortalRole(null);
    setShowLanding(true); // Return to the landing page upon logout
  };

  // STEP 1: Show the Landing Page first
  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // STEP 2: If they clicked 'Get Started' but aren't logged in, show the Login Portal
  if (!isLoggedIn) {
    return (
      <LoginPortal 
        onLogin={handleLogin} 
        onBack={() => setShowLanding(true)} // <-- Passed the prop directly here!
      />
    );
  }

  // STEP 3: Authenticated Portal View
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 py-3 px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-gray-900">
            InstaBiz{' '}
            <span className="text-indigo-600 text-xs px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-200 uppercase">
              {portalRole} PORTAL
            </span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            👤 {currentUser.email}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-xs font-bold transition"
          >
            Sign Out 🚪
          </button>
        </div>
      </header>

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
        {portalRole === 'vendor' && <VendorPortal />}
        {portalRole === 'advertiser' && <AdvertiserPortal />}
        {portalRole === 'admin' && <AdminPortal />}
      </main>
    </div>
  );
}