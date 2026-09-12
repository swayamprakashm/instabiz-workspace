import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AutomationPricingCard({ storeId }) {
  const [frequency, setFrequency] = useState('daily');
  const [duration, setDuration] = useState(3);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const frequencyLabels = {
    daily: '1 Post/Day (24/7 Automation)',
    every_3_days: '1 Post/3 Days Rotation',
    weekly: '1 Post/Week Schedule'
  };

  const handleSubscribe = async () => {
    if (!storeId) {
      setErrorMsg('Please generate a storefront first!');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Call Django Backend API
      const res = await fetch('http://127.0.0.1:8000/api/subscribe/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          store_id: storeId, 
          frequency, 
          duration_months: duration 
        })
      });
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        // 2. Sync Order to Firebase Firestore so Advertiser Portal can see it
        await addDoc(collection(db, 'campaignRequests'), {
          business: `Store (${storeId})`,
          network: `Automation: ${frequencyLabels[frequency]}`,
          duration: `${duration} Months`,
          amount: `₹${data.total_cost || (duration * 1200)}`,
          status: 'Pending Review',
          createdAt: serverTimestamp()
        });

        setSuccessMsg(`Automation active! Synced to Cloud. Total: ₹${data.total_cost || 'N/A'}`);
      } else {
        setErrorMsg(data.message || 'Failed to activate subscription.');
      }
    } catch (err) {
      setErrorMsg('Network error connecting to backend or Firebase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border mt-6">
      <h3 className="text-lg font-bold text-gray-800">🚀 24/7 Social Media Automation</h3>
      <p className="text-sm text-gray-600 mb-4">Let InstaBiz automatically advertise your small business across platforms.</p>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { id: 'daily', label: '1 Post/Day' },
          { id: 'every_3_days', label: '1 Post/3 Days' },
          { id: 'weekly', label: '1 Post/Week' }
        ].map((freq) => (
          <button
            key={freq.id}
            onClick={() => setFrequency(freq.id)}
            className={`p-2 text-xs font-semibold rounded-lg border transition ${
              frequency === freq.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {freq.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {[3, 6, 9].map((months) => (
          <button
            key={months}
            onClick={() => setDuration(months)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition ${
              duration === months ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {months} Months
          </button>
        ))}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? 'Activating Plan...' : 'Activate Automation Plan'}
      </button>

      {successMsg && <p className="text-xs text-green-600 mt-3 font-medium text-center">{successMsg}</p>}
      {errorMsg && <p className="text-xs text-red-600 mt-3 font-medium text-center">{errorMsg}</p>}
    </div>
  );
}