import React, { useState } from 'react';

const StoreGeneratorForm = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    description: '',
    themeOption: 'Modern',
    colorOption: 'Indigo',
    fontOption: 'Sans-Serif',
    heroFeature: 'Large Image',
    uiOption: 'Minimalist'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">InstaBiz Store Generator</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter your business details to instantly provision your AI-powered landing page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Core Business Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g., RS Ghee Products"
              className="w-full rounded-lg border-gray-300 border p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry / Niche</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g., Food & Organic Retail"
              className="w-full rounded-lg border-gray-300 border p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What do you sell?</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe your products, flavor profiles, or target audience..."
              className="w-full rounded-lg border-gray-300 border p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            ></textarea>
          </div>
        </div>

        {/* New Design Preferences Section */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Design Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Theme</label>
              <select
                name="themeOption"
                value={formData.themeOption}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="Modern">Modern</option>
                <option value="Classic">Classic</option>
                <option value="Playful">Playful</option>
                <option value="Dark Mode">Dark Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Color Palette</label>
              <select
                name="colorOption"
                value={formData.colorOption}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="Indigo">Indigo</option>
                <option value="Emerald">Emerald Green</option>
                <option value="Rose">Rose Red</option>
                <option value="Slate">Slate / Monochrome</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Typography</label>
              <select
                name="fontOption"
                value={formData.fontOption}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="Sans-Serif">Sans-Serif (Clean)</option>
                <option value="Serif">Serif (Elegant)</option>
                <option value="Monospace">Monospace (Tech)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">UI Style</label>
              <select
                name="uiOption"
                value={formData.uiOption}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="Minimalist">Minimalist</option>
                <option value="Glassmorphism">Glassmorphism</option>
                <option value="Brutalism">Brutalism</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Hero Section Feature</label>
              <select
                name="heroFeature"
                value={formData.heroFeature}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="Large Image">Large Hero Image</option>
                <option value="Product Showcase">Product Showcase Grid</option>
                <option value="Call to Action Centered">Centered Call-to-Action</option>
              </select>
            </div>

          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 mt-2 rounded-lg text-white font-medium shadow-md transition-all ${
            isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? 'AI is building your website...' : 'Generate Storefront 🚀'}
        </button>
      </form>
    </div>
  );
};

export default StoreGeneratorForm;