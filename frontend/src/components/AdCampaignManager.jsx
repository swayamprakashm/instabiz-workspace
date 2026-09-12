import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AdCampaignManager({ storeId }) {
  const [step, setStep] = useState(1);
  const [activeStoreId, setActiveStoreId] = useState(storeId);
  
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [brandColor, setBrandColor] = useState('Orange');
  const [selectedTheme, setSelectedTheme] = useState('Festive'); // 👈 Theme Vibe State

  const [productDetails, setProductDetails] = useState('');
  const [adHtml, setAdHtml] = useState(null);
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [duration, setDuration] = useState(3);
  const [adNetwork, setAdNetwork] = useState('Google Ads');
  
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  const pricingTiers = {
    3: { rate: 1200, total: 3600, label: '3 Months', tag: 'Standard' },
    6: { rate: 1000, total: 6000, label: '6 Months', tag: 'Popular' },
    12: { rate: 800, total: 9600, label: '12 Months', tag: 'Best Value' }
  };

  const currentTier = pricingTiers[duration];
  const totalPrice = currentTier.total;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateAd = async () => {
    if (!productDetails.trim()) {
      setErrorMessage('Please enter product details first.');
      return;
    }

    if (!activeStoreId && (!businessName.trim() || !industry.trim())) {
      setErrorMessage('Please provide your Business Name and Industry.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('store_id', activeStoreId || '');
      formData.append('business_name', businessName);
      formData.append('industry', industry);
      formData.append('brand_color', brandColor);
      formData.append('theme', selectedTheme); // 👈 Passing selected theme vibe to backend
      formData.append('product_details', productDetails);
      
      if (imageFile) {
        formData.append('product_image', imageFile); // Optional image file
      }

      const response = await fetch('http://127.0.0.1:8000/api/generate-ad/', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        if (data.store_id) setActiveStoreId(data.store_id);
        setAdHtml(data.html_banner);
        setStep(2);
      } else {
        if (data.message && data.message.includes('503')) {
          setErrorMessage('The AI model is experiencing high traffic. Please wait a few seconds and try again!');
        } else {
          setErrorMessage(data.message || 'Failed to generate ad banner.');
        }
      }
    } catch (err) {
      setErrorMessage('Network error connecting to the ad generation service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    const fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Ad Banner</title><script src="https://cdn.tailwindcss.com"></script></head><body class="p-4 flex items-center justify-center min-h-screen bg-slate-900">${adHtml}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ad_banner.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProceedToPayment = () => {
    setStep(3);
  };

  const handleCompletePayment = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const invoiceId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    const transactionId = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const fullInvoiceData = {
      invoiceId,
      transactionId,
      business: businessName || 'My Storefront',
      network: adNetwork,
      duration: `${duration} Months`,
      amount: `₹${totalPrice.toLocaleString()}`,
      paymentMethod,
      paymentStatus: 'Paid & Verified ✅',
      status: 'Pending Advertiser Approval',
      adHtmlContent: adHtml || '<p>Custom Creative Banner</p>',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'campaignRequests'), fullInvoiceData);
      setInvoiceDetails(fullInvoiceData);
      setStep(4);
    } catch (err) {
      setErrorMessage('Firebase error syncing campaign order and invoice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadInvoicePDF = () => {
    if (!invoiceDetails) return;
    const invoiceContent = `
      ========================================
      INSTABIZ COMMERCIAL AD CAMPAIGN INVOICE
      ========================================
      Invoice ID: ${invoiceDetails.invoiceId}
      Transaction ID: ${invoiceDetails.transactionId}
      Date: ${new Date().toLocaleDateString()}
      ----------------------------------------
      Business Name: ${invoiceDetails.business}
      Ad Network: ${invoiceDetails.network}
      Campaign Duration: ${invoiceDetails.duration}
      Payment Method: ${invoiceDetails.paymentMethod}
      Status: ${invoiceDetails.paymentStatus}
      ----------------------------------------
      Total Amount Paid: ${invoiceDetails.amount}
      ========================================
      Thank you for advertising with InstaBiz!
    `;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoiceDetails.invoiceId}_Invoice.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-3xl mx-auto">
      {errorMessage && (
        <div className="mb-6 bg-red-50 text-red-700 border border-red-200 text-sm p-4 rounded-xl font-medium">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: Create Ad Creative */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">1. Create Ad Creative</h2>
            <p className="text-sm text-slate-500 mt-0.5">Configure your brand identity, theme vibe, and product details.</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-4">
            <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-slate-400">Brand & Theme Configuration</div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Ganesh Idols"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Retail & Festivals"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Color Theme</label>
              <input
                type="text"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                placeholder="e.g. Orange, Gold"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Vibe / Theme</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white font-semibold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Festive">✨ Festive & Vibrant</option>
                <option value="Ritual">🪔 Ritual & Traditional</option>
                <option value="Party">🎉 Party & Celebration</option>
                <option value="Casual">🛒 Casual & Everyday</option>
                <option value="Minimalist">💎 Minimalist & Elite</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Product & Offer Details</label>
            <textarea
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              placeholder="Describe the product for the ad (e.g., Beautiful lord Ganesh idol @₹299 Limited Offer)..."
              className="w-full p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              rows="3"
            />
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500 hover:bg-slate-50/50 transition relative group overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            
            {imagePreview ? (
              <div className="flex flex-col items-center pointer-events-none">
                <img src={imagePreview} alt="Preview" className="h-32 object-contain mb-2 rounded-lg shadow-sm" />
                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full">Click to change image</span>
              </div>
            ) : (
              <div className="pointer-events-none py-2">
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">📸</span>
                <span className="text-sm font-medium text-slate-600">Click or drag product image here <span className="text-slate-400">(Optional)</span></span>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateAd}
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 text-sm"
          >
            {isSubmitting ? 'AI is generating Ads banner...' : 'Generate Ad Banner 🚀'}
          </button>
        </div>
      )}

      {/* STEP 2: Preview & Campaign Sale */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">2. Preview & Campaign Sale</h2>
              <p className="text-sm text-slate-500 mt-0.5">Review your generated banner and configure your target network placement.</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition flex items-center gap-1"
            >
              ⬅️ Back to Edit
            </button>
          </div>
          
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            <div className="absolute top-3 left-4 text-[11px] font-mono uppercase tracking-widest text-indigo-400">Live Ad Preview</div>
            <div className="my-4 p-2 bg-white rounded-xl shadow-2xl">
              <div dangerouslySetInnerHTML={{ __html: adHtml }} />
            </div>
            <button onClick={handleDownload} className="mt-2 text-xs font-semibold text-indigo-300 hover:text-white transition flex items-center gap-1.5 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700">
              <span>⬇️</span> Download Banner HTML
            </button>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-5">
            <h3 className="text-lg font-bold text-slate-900">3. Go for Advertisement Sale</h3>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Campaign Duration & Pricing Tiers</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(pricingTiers).map(([months, tier]) => (
                  <button
                    key={months}
                    onClick={() => setDuration(Number(months))}
                    className={`py-3.5 px-3 rounded-xl border transition flex flex-col items-center text-center ${
                      duration === Number(months) 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-semibold opacity-80">{tier.label}</span>
                    <span className="text-base font-black mt-0.5">₹{tier.total.toLocaleString()}</span>
                    <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full font-medium ${
                      duration === Number(months) ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tier.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-slate-50 p-4 rounded-xl border border-indigo-100/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wide block">Selected Plan Total</span>
                <span className="text-xs text-slate-500">{duration} Months automated network rotation</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600">₹{totalPrice.toLocaleString()}</span>
                <span className="text-xs text-slate-400 block">(@ ₹{currentTier.rate}/mo)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select Advertising Network</label>
              <div className="grid grid-cols-3 gap-3">
                {['Google Ads', 'Meta (FB/IG)', 'TikTok Ads'].map((net) => (
                  <button
                    key={net}
                    onClick={() => setAdNetwork(net)}
                    className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition ${
                      adNetwork === net
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm ring-2 ring-indigo-500/20'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 text-sm tracking-wide"
            >
              Proceed to Secure Checkout (₹{totalPrice.toLocaleString()}) 💳
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Demo Payment Gateway */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">3. Secure Demo Checkout</h2>
              <p className="text-sm text-slate-500 mt-0.5">Select a temporary demo payment method to authorize your campaign order.</p>
            </div>
            <button onClick={() => setStep(2)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition">⬅️ Back</button>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <span className="text-sm font-semibold text-slate-600">Total Payable Amount:</span>
              <span className="text-2xl font-black text-emerald-600">₹{totalPrice.toLocaleString()}</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Choose Payment Method (Demo)</label>
              <div className="grid grid-cols-3 gap-3">
                {['UPI', 'Credit Card', 'Net Banking'].map((method) => (
                  <button key={method} onClick={() => setPaymentMethod(method)} className={`py-3 text-xs font-bold rounded-xl border transition ${paymentMethod === method ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-slate-700 border-slate-200'}`}>
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Enter UPI ID</label>
                <input type="text" placeholder="username@oksbi" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50" defaultValue="vendor@instabizpay" />
              </div>
            )}

            {paymentMethod === 'Credit Card' && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                  <input type="text" defaultValue="4532 •••• •••• 8890" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50" />
                </div>
              </div>
            )}

            <button
              onClick={handleCompletePayment}
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg text-sm tracking-wide disabled:opacity-50"
            >
              {isSubmitting ? 'Processing Payment & Syncing Invoice...' : `Pay ₹{totalPrice.toLocaleString()} & Complete Order 🚀`}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success & Invoice Summary Download */}
      {step === 4 && invoiceDetails && (
        <div className="text-center py-8 space-y-4">
          <div className="text-6xl mb-2">🎉</div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment Successful & Invoice Generated!</h2>
          <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
            Your campaign order and complete invoice details have been securely synced to Firebase Firestore for <span className="font-semibold text-slate-700">{adNetwork}</span>.
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left max-w-md mx-auto space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Invoice ID:</span><span className="font-bold text-slate-800">{invoiceDetails.invoiceId}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Transaction ID:</span><span className="font-bold text-slate-800">{invoiceDetails.transactionId}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Business:</span><span className="font-bold text-slate-800">{invoiceDetails.business}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Network:</span><span className="font-bold text-indigo-600">{invoiceDetails.network}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Paid Amount:</span><span className="font-black text-emerald-600">{invoiceDetails.amount}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="text-slate-500">Status:</span><span className="font-bold text-emerald-600">{invoiceDetails.paymentStatus}</span></div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleDownloadInvoicePDF}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow"
            >
              📥 Download Invoice Summary (PDF/Text)
            </button>
            <button
              onClick={() => {
                setStep(1);
                setProductDetails('');
                setImageFile(null);
                setImagePreview(null);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow"
            >
              Create another campaign ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}