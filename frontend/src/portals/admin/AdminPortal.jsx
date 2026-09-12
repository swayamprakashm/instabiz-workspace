import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function AdminPortal() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'users', 'campaigns'
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Master inspection modal state
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const campaignsSnap = await getDocs(collection(db, 'campaignRequests'));
      setCampaigns(campaignsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user ID?")) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Download Payment Invoice as text/PDF report
  const handleDownloadInvoice = (c) => {
    const invoiceContent = `
      ========================================
      INSTABIZ ADMIN - MASTER TRANSACTION INVOICE
      ========================================
      Invoice ID: ${c.invoiceId || 'INV-MASTER-01'}
      Transaction ID: ${c.transactionId || 'TXN-MASTER-01'}
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
      Verified by InstaBiz Admin Ledger
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

  const vendorCount = users.filter(u => u.role === 'vendor').length;
  const advertiserCount = users.filter(u => u.role === 'advertiser').length;

  return (
    <div className="w-full space-y-6 max-w-5xl mx-auto px-4 py-6">

      {/* HOME VIEW */}
      {currentView === 'home' && (
        <div className="flex flex-col items-center justify-center mt-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 uppercase tracking-widest">Admin Workspace</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">🛡️ Admin Master Control Center</h2>
            <p className="text-sm text-slate-500">Complete oversight of user accounts, payment invoices, and ad campaign pipelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button 
              onClick={() => setCurrentView('users')}
              className="p-8 bg-white border-2 border-purple-100 rounded-2xl shadow-sm hover:border-purple-600 hover:shadow-md transition text-left group"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">👥</span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition">User Accounts Oversight</h3>
              <p className="text-sm text-slate-500 mt-1">Manage registered vendor and advertiser profiles.</p>
            </button>

            <button 
              onClick={() => setCurrentView('campaigns')}
              className="p-8 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-md transition text-left group"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📊</span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">Master Transaction & Ad Ledger</h3>
              <p className="text-sm text-slate-500 mt-1">Inspect full payment invoices, transaction IDs, and ad creatives.</p>
            </button>
          </div>
        </div>
      )}

      {/* USERS VIEW */}
      {currentView === 'users' && (
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
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">👥 Registered User Accounts</h2>
                <p className="text-sm text-slate-500 mt-0.5">Total Vendors: {vendorCount} | Total Advertisers: {advertiserCount}</p>
              </div>
              <button onClick={fetchAdminData} className="text-xs bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700 transition">
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-sm">Loading users from Firestore...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">No registered users found yet.</div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                      <th className="p-4">Role</th>
                      <th className="p-4">Username / Name</th>
                      <th className="p-4">Email ID</th>
                      <th className="p-4">Details / Company</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                            u.role === 'vendor' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-800">{u.username || u.name || 'N/A'}</td>
                        <td className="p-4 text-slate-600">{u.email}</td>
                        <td className="p-4 text-slate-500 text-xs">
                          {u.role === 'vendor' ? `Name: ${u.name || 'N/A'}` : `Company: ${u.companyName || 'N/A'} (${u.personName || 'N/A'})`}
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg text-xs font-bold transition"
                          >
                            🗑️ Remove ID
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

      {/* MASTER CAMPAIGNS & INVOICE LEDGER VIEW */}
      {currentView === 'campaigns' && (
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
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">📊 Master Transaction & Ad Ledger</h2>
                <p className="text-sm text-slate-500 mt-0.5">Complete platform revenue orders & ad campaigns synced from Firestore.</p>
              </div>
              <button onClick={fetchAdminData} className="text-xs bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700 transition">
                🔄 Refresh
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">No transactions or campaigns recorded yet.</div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                      <th className="p-4">Business</th>
                      <th className="p-4">Network</th>
                      <th className="p-4">Duration & Cost</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-800">{c.business}</td>
                        <td className="p-4 text-indigo-600 font-semibold">{c.network}</td>
                        <td className="p-4 text-slate-600">{c.duration} <span className="font-black text-slate-900 block">{c.amount}</span></td>
                        <td className="p-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                            {c.paymentStatus || c.status}
                          </span>
                        </td>
                        <td className="p-4 flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCampaign(c)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl font-bold text-xs shadow-md transition"
                          >
                            🔍 Inspect Details
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

      {/* MASTER INSPECTION MODAL WITH DOWNLOAD BUTTONS */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-black text-slate-900">🛡️ Admin Master Order Inspection</h3>
              <button onClick={() => setSelectedCampaign(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              {/* SECTION 1: INVOICE & PAYMENT METADATA */}
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
                  <div className="flex justify-between"><span className="text-slate-500">Invoice ID:</span><span className="font-bold text-slate-800">{selectedCampaign.invoiceId || 'INV-TEMP-01'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Transaction ID:</span><span className="font-bold text-slate-800">{selectedCampaign.transactionId || 'TXN-DEMO-998'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Payment Method:</span><span className="font-bold text-slate-800">{selectedCampaign.paymentMethod || 'UPI / Demo Gateway'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Total Amount Paid:</span><span className="font-black text-emerald-600">{selectedCampaign.amount}</span></div>
                  <div className="flex justify-between border-t pt-2"><span className="text-slate-500">Payment Status:</span><span className="font-bold text-emerald-600">{selectedCampaign.paymentStatus || 'Paid & Verified ✅'}</span></div>
                </div>
              </div>

              {/* SECTION 2: VENDOR & CAMPAIGN DETAILS */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">📢 Campaign & Business Details</span>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between"><span className="text-slate-500">Business Name:</span><span className="font-bold text-slate-800">{selectedCampaign.business}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Target Ad Network:</span><span className="font-bold text-indigo-600">{selectedCampaign.network}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Duration:</span><span className="font-bold text-slate-800">{selectedCampaign.duration}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Approval Workflow Status:</span><span className="font-bold text-slate-700">{selectedCampaign.status}</span></div>
                </div>
              </div>

              {/* SECTION 3: AD BANNER CREATIVE PREVIEW & DOWNLOAD */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">🎨 Generated Ad Banner Template</span>
                  <button 
                    onClick={() => handleDownloadTemplate(selectedCampaign)}
                    className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 px-3 py-1 rounded-lg font-bold transition flex items-center gap-1"
                  >
                    ⬇️ Download Ad Template HTML
                  </button>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl flex items-center justify-center shadow-inner overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: selectedCampaign.adHtmlContent || '<p class="text-white">Banner Creative HTML</p>' }} />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setSelectedCampaign(null)} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-xs transition shadow"
              >
                Close Master Inspection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}