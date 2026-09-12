import React, { useState } from 'react';
import StoreGeneratorForm from '../../components/StoreGeneratorForm';
import LivePreview from '../../components/LivePreview';
import AdCampaignManager from '../../components/AdCampaignManager';

export default function VendorPortal() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'build', 'advertise'
  const [isLoading, setIsLoading] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateStore = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Connect to your Django backend endpoint here
      const response = await fetch('http://127.0.0.1:8000/api/generate-store/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: formData.businessName,
          industry: formData.industry,
          description: formData.description,
          theme_option: formData.themeOption,
          color_option: formData.colorOption,
          font_option: formData.fontOption,
          ui_option: formData.uiOption,
          hero_feature: formData.heroFeature,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStoreData({
          store_id: data.store_id || 'STORE-01',
          data: data.data || data
        });
      } else {
        setError(data.message || 'Failed to generate store.');
      }
    } catch (err) {
      setError('Network error connecting to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 max-w-7xl mx-auto px-4 py-6">
      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>}

      {/* HOME DASHBOARD SELECTION */}
      {currentView === 'home' && (
        <div className="flex flex-col items-center justify-center mt-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 uppercase tracking-widest">Vendor Workspace</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">What would you like to do today?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button 
              onClick={() => setCurrentView('build')}
              className="p-8 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-md transition text-left group"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🛠️</span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">Web Building</h3>
              <p className="text-sm text-slate-500 mt-1">Create or manage your custom business storefront and layouts.</p>
            </button>

            <button 
              onClick={() => setCurrentView('advertise')}
              className="p-8 bg-white border-2 border-emerald-100 rounded-2xl shadow-sm hover:border-emerald-600 hover:shadow-md transition text-left group"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📢</span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">Web Advertise</h3>
              <p className="text-sm text-slate-500 mt-1">Design ad banners and send campaign orders to the advertiser queue.</p>
            </button>
          </div>
        </div>
      )}

      {/* WEB BUILDING VIEW (With Back Button) */}
      {currentView === 'build' && (
        <div className="space-y-6">
          {/* Universal Back Button */}
          <div>
            <button 
              onClick={() => setCurrentView('home')} 
              className="text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              ⬅️ Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <StoreGeneratorForm onGenerate={handleGenerateStore} isLoading={isLoading} />
            <div className="space-y-4">
              <LivePreview result={storeData} isLoading={isLoading} />
              {storeData && (
                <div className="text-right">
                  <button 
                    onClick={() => setCurrentView('advertise')} 
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-md transition"
                  >
                    Proceed to Web Advertise 🚀
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WEB ADVERTISE VIEW (With Back Button) */}
      {currentView === 'advertise' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Universal Back Button */}
          <div>
            <button 
              onClick={() => setCurrentView('home')} 
              className="text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              ⬅️ Back to Dashboard
            </button>
          </div>
          
          <AdCampaignManager storeId={storeData ? storeData.store_id : null} />
        </div>
      )}
    </div>
  );
}