import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function AdvertiserPortal() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'queue', 'history'
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State for Inspecting Invoice & Ad Creative Details
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'campaignRequests'));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCampaigns(list);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleGrabDeal = async (id) => {
    try {
      const campaignRef = doc(db, 'campaignRequests', id);
      await updateDoc(campaignRef, { status: 'Grabbed & Active 🤝' });
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'Grabbed & Active 🤝' } : c));
      setSelectedCampaign(null);
    } catch (err) {
      console.error("Error updating campaign status:", err);
    }
  };

  // Download Payment Invoice as text/PDF summary report
  const handleDownloadInvoice = (c) => {
    const invoiceContent = `
      ========================================
      INSTABIZ ADVERTISER - CAMPAIGN INVOICE
      ========================================
      Invoice ID: ${c.invoiceId || 'INV-892341'}
      Transaction ID: ${c.transactionId || 'TXN-ABC9981'}
      Date: ${new Date().toLocaleDateString()}
      ----------------------------------------
      Business Name: ${c.business}
      Ad Network: ${c.network}
      Campaign Duration: ${c.duration}
      Payment Method: ${c.paymentMethod || 'UPI / Card'}
      Payment Status: ${c.paymentStatus || 'Paid & Verified ✅'}
      ----------------------------------------
      Total Amount Paid: ${c.amount}
      ========================================
      Thank you for advertising with InstaBiz!
    `;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.business.replace(/\s+/g, '_')}_Invoice.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Generated Ad Template as HTML file
  const handleDownloadTemplate = (c) => {
    const fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${c.business} Ad Banner</title><script src="https://cdn.tailwindcss.com"></script></head><body class="p-4 flex items-center justify-center min-h-screen bg-slate-900">${c.adHtmlContent || '<p>Ad Template</p>'}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.business.replace(/\s+/g, '_')}_ad_template.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pendingCampaigns = campaigns.filter(c => c.status !== 'Grabbed & Active 🤝');
  const grabbedCampaigns = campaigns.filter(c => c.status === 'Grabbed & Active 🤝');

  return (
    <div className="w-full space-y-6 max-w-5xl mx-auto px-4 py-6">
      
      {/* HOME VIEW */}
      {currentView === 'home' && (
        <div className="flex flex-col items-center justify-center mt-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-widest">Advertiser Workspace</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Advertiser Command Center</h2>
            <p className="text-sm text-slate-500">Monitor incoming paid vendor campaign requests and inspect full invoice details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button 
              onClick={() => setCurrentView('queue')}
              className="p-8 bg-white border-2 border-emerald-100 rounded-2xl shadow-sm hover:border-emerald-600 hover:shadow-md transition text-left group"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📋</span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">Live Campaign Queue</h3>
              <p className="text-sm text-slate-500 mt-1">Review paid ad requests, check invoices, and grab deals.</p>
            </button>

            <button 
              onClick={() => setCurrentView('history')}
              className="p-8 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-md transition text-left group"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🤝</span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">Active / Grabbed Deals</h3>
              <p className="text-sm text-slate-500 mt-1">View campaigns you have successfully grabbed and approved.</p>
            </button>
          </div>
        </div>
      )}

      {/* QUEUE VIEW */}
      {currentView === 'queue' && (
        <div className="space-y-6">
          <div>
            <button 
              onClick={() => setCurrentView('home')} 
              className="text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              ⬅️ Back to Dashboard
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">📋 Live Campaign Queue</h2>
                <p className="text-sm text-slate-500 mt-0.5">Paid vendor campaign orders synced from Firestore.</p>
              </div>
              <button onClick={fetchCampaigns} className="text-xs bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700 transition">
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-sm">Loading campaign requests...</div>
            ) : pendingCampaigns.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">No pending campaign requests in the queue right now.</div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                      <th className="p-4">Business / Store</th>
                      <th className="p-4">Network</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {pendingCampaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-800">{c.business}</td>
                        <td className="p-4 text-indigo-600 font-semibold">{c.network}</td>
                        <td className="p-4 text-slate-600">{c.duration}</td>
                        <td className="p-4 font-black text-slate-900">{c.amount}</td>
                        <td className="p-4 flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCampaign(c)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-bold text-xs transition"
                          >
                            📥 View Details
                          </button>
                          <button
                            onClick={() => handleGrabDeal(c.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md transition"
                          >
                            🤝 Grab Deal
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HISTORY VIEW */}
      {currentView === 'history' && (
        <div className="space-y-6">
          <div>
            <button 
              onClick={() => setCurrentView('home')} 
              className="text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              ⬅️ Back to Dashboard
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">🤝 Grabbed & Active Deals</h2>
            <p className="text-sm text-slate-500 mt-0.5">Campaigns successfully claimed under your advertiser account.</p>

            {grabbedCampaigns.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">You haven't grabbed any deals yet. Check the Live Queue!</div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                      <th className="p-4">Business</th>
                      <th className="p-4">Network</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {grabbedCampaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-800">{c.business}</td>
                        <td className="p-4 text-indigo-600">{c.network}</td>
                        <td className="p-4 text-slate-600">{c.duration}</td>
                        <td className="p-4 font-black text-slate-900">{c.amount}</td>
                        <td className="p-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedCampaign(c)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-bold text-xs transition"
                          >
                            📥 View Details & Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INSPECTION MODAL WITH SEPARATE DOWNLOAD ACTIONS */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900">📄 Invoice & Ad Creative Inspector</h3>
              <button onClick={() => setSelectedCampaign(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              {/* PAYMENT & INVOICE SECTION */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600">💳 Payment & Invoice Records</span>
                  <button 
                    onClick={() => handleDownloadInvoice(selectedCampaign)}
                    className="text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 px-3 py-1 rounded-lg font-bold transition flex items-center gap-1"
                  >
                    📥 Download Invoice Summary
                  </button>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between"><span className="text-slate-500">Invoice ID:</span><span className="font-bold text-slate-800">{selectedCampaign.invoiceId || 'INV-892341'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Transaction ID:</span><span className="font-bold text-slate-800">{selectedCampaign.transactionId || 'TXN-ABC9981'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Business Name:</span><span className="font-bold text-slate-800">{selectedCampaign.business}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Target Network:</span><span className="font-bold text-indigo-600">{selectedCampaign.network}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Duration:</span><span className="font-bold text-slate-800">{selectedCampaign.duration}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Payment Method:</span><span className="font-bold text-slate-800">{selectedCampaign.paymentMethod || 'UPI / Card'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Paid Amount:</span><span className="font-black text-emerald-600">{selectedCampaign.amount}</span></div>
                  <div className="flex justify-between border-t pt-2"><span className="text-slate-500">Payment Status:</span><span className="font-bold text-emerald-600">{selectedCampaign.paymentStatus || 'Paid & Verified ✅'}</span></div>
                </div>
              </div>

              {/* AD BANNER TEMPLATE SECTION */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">🎨 Generated Ad Banner Template</span>
                  <button 
                    onClick={() => handleDownloadTemplate(selectedCampaign)}
                    className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 px-3 py-1 rounded-lg font-bold transition flex items-center gap-1"
                  >
                    ⬇️ Download Ad Template
                  </button>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl flex items-center justify-center shadow-inner overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: selectedCampaign.adHtmlContent || '<p class="text-white">Custom Banner Creative</p>' }} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {selectedCampaign.status !== 'Grabbed & Active 🤝' && (
                <button 
                  onClick={() => handleGrabDeal(selectedCampaign.id)} 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-md transition"
                >
                  🤝 Grab This Deal Now
                </button>
              )}
              <button 
                onClick={() => setSelectedCampaign(null)} 
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}