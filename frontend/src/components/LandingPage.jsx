import React from 'react';

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden scroll-smooth">
      
      {/* NAVIGATION BAR */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Replaced text logo with Image Logo */}
          <img 
            src="/imglogo.png" 
            alt="InstaBiz Logo" 
            className="h-10 md:h-12 w-auto object-contain"
            onError={(e) => {
              // Fallback just in case the image path is wrong initially
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/150x50/4F46E5/FFFFFF?text=InstaBiz&font=Montserrat";
            }}
          />
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition">How it Works</a>
          <a href="#pricing" className="hover:text-indigo-600 transition">Pricing</a>
        </div>
        <div>
          <button 
            onClick={onGetStarted}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-md"
          >
            Vendor Portal ➡️
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-24 pb-32 px-8 text-center flex flex-col items-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50"></div>
        
        {/* Hackathon Badge */}
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-[11px] tracking-widest uppercase shadow-sm">
          🚀 Fusionix26 Hackathon Project
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl leading-tight mb-6">
          AI-Powered Marketing for <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
            Every Independent Business
          </span>
        </h1>
        
        <p className="text-lg text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium">
          Generate stunning storefronts, launch highly-converting ad banners, and automate your 24/7 marketing campaigns in seconds using advanced AI. No design skills required.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={onGetStarted}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-lg transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            Launch Your Campaign 🚀
          </button>
          <a href="#how-it-works" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg transition shadow-sm inline-flex items-center justify-center">
            See How It Works
          </a>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Everything you need to scale</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">InstaBiz provides a complete ecosystem to take your products from the shelf to the digital world instantly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-bold mb-3">Instant Storefronts</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Describe your business and let our AI generate a fully responsive, Tailwind-styled landing page tailored to your specific industry and brand colors.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">Most Popular</div>
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-indigo-950 mb-3">Smart Ad Creatives</h3>
              <p className="text-indigo-900/70 text-sm leading-relaxed">
                Upload your product image, select a vibe (Festive, Minimalist, etc.), and instantly generate production-ready HTML ad banners that convert.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-3">Automated Campaigns</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Select your network (Google Ads, Meta) and duration. Our platform securely handles billing and synchronizes your ads directly to the networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">How it works</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">Go from an idea to a live ad campaign across multiple networks in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-indigo-100 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-2xl border border-indigo-100 shadow-lg flex items-center justify-center text-3xl font-black text-indigo-600 mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Configure Brand Identity</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Enter your business name, industry, and brand colors. Upload your product photo and select a campaign vibe (Festive, Party, Minimalist).
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center text-3xl font-black text-white mb-6 transform md:-translate-y-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">AI Generates Creatives</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our Gemini AI engine instantly crafts optimized HTML/Tailwind ad banners matching your brand perfectly. Download or edit on the fly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-2xl border border-indigo-100 shadow-lg flex items-center justify-center text-3xl font-black text-emerald-500 mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Launch & Automate</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Choose your ad network (Google, Meta), pick a campaign duration, and complete a secure checkout. Your ad goes live immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-8 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">No hidden fees. Choose your automated campaign duration and we handle the network distribution.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {/* Standard Tier */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Standard</span>
              <div className="mt-4 mb-2">
                <span className="text-5xl font-black text-slate-900">₹3,600</span>
              </div>
              <p className="text-slate-500 text-sm mb-6 font-medium">3 Months Campaign</p>
              <ul className="text-left space-y-3 mb-8 text-sm text-slate-700 font-medium">
                <li className="flex gap-2"><span>✅</span> AI Ad Banner Generation</li>
                <li className="flex gap-2"><span>✅</span> 1 Network (Google or Meta)</li>
                <li className="flex gap-2"><span>✅</span> Basic Performance Tracking</li>
              </ul>
              <button onClick={onGetStarted} className="w-full bg-white text-slate-900 border border-slate-200 py-3 rounded-xl font-bold hover:bg-slate-100 transition">
                Start Standard
              </button>
            </div>

            {/* Popular Tier */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center transform md:-translate-y-4 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Growth</span>
              <div className="mt-4 mb-2">
                <span className="text-5xl font-black text-white">₹6,000</span>
              </div>
              <p className="text-slate-400 text-sm mb-6 font-medium">6 Months Campaign</p>
              <ul className="text-left space-y-3 mb-8 text-sm text-slate-300 font-medium">
                <li className="flex gap-2"><span>✅</span> Unlimited Ad Variations</li>
                <li className="flex gap-2"><span>✅</span> 2 Networks (Google + Meta)</li>
                <li className="flex gap-2"><span>✅</span> Multi-Theme Adaptations</li>
                <li className="flex gap-2"><span>✅</span> Priority Support</li>
              </ul>
              <button onClick={onGetStarted} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition shadow-lg">
                Get Started
              </button>
            </div>

            {/* Best Value Tier */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Best Value</span>
              <div className="mt-4 mb-2">
                <span className="text-5xl font-black text-slate-900">₹9,600</span>
              </div>
              <p className="text-slate-500 text-sm mb-6 font-medium">12 Months Campaign</p>
              <ul className="text-left space-y-3 mb-8 text-sm text-slate-700 font-medium">
                <li className="flex gap-2"><span>✅</span> Everything in Growth</li>
                <li className="flex gap-2"><span>✅</span> All Networks (Inc. TikTok)</li>
                <li className="flex gap-2"><span>✅</span> Auto-A/B Testing AI</li>
              </ul>
              <button onClick={onGetStarted} className="w-full bg-white text-slate-900 border border-slate-200 py-3 rounded-xl font-bold hover:bg-slate-100 transition">
                Start Annual Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-8 bg-slate-900 text-white text-center">
        <h2 className="text-4xl font-black tracking-tight mb-6">Ready to grow your business?</h2>
        <p className="text-slate-400 max-w-lg mx-auto mb-10">Join the next generation of independent retailers leveraging AI to dominate their local markets.</p>
        <button 
          onClick={onGetStarted}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-10 py-4 rounded-2xl font-black text-lg transition shadow-lg shadow-emerald-500/20"
        >
          Start Generating for Free
        </button>
      </section>

      {/* TEAM & HACKATHON FOOTER */}
      <footer className="py-10 text-center bg-white border-t border-slate-100 flex flex-col items-center">
        <p className="font-bold text-slate-500 tracking-widest uppercase text-[11px] mb-3">
          🚀 Fusionix26 Hackathon 
        </p>
        <p className="font-medium text-slate-600 mb-2">
          Developed By <span className="text-indigo-600 font-black text-lg ml-1">Quad Core Team</span>
        </p>
        <p className="text-slate-400 text-xs font-medium">© {new Date().getFullYear()} InstaBiz.</p>
      </footer>
    </div>
  );
}