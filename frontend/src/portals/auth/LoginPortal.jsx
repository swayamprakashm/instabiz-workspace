import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function LoginPortal({ onLogin, onBack }) {
  const [role, setRole] = useState('vendor'); // 'vendor', 'advertiser', 'admin'
  const [isRegistering, setIsRegistering] = useState(false);

  // Form Fields
  const [identifier, setIdentifier] = useState(''); // Can be Email OR Username
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [personName, setPersonName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (role === 'admin') {
        if (!identifier.includes('admin')) {
          setErrorMsg('Invalid Admin credentials.');
          setLoading(false);
          return;
        }
        onLogin(identifier, 'admin');
        return;
      }

      if (isRegistering) {
        // --- NEW REGISTRATION ---
        const userCredential = await createUserWithEmailAndPassword(auth, identifier, password);
        const user = userCredential.user;

        const userData = {
          uid: user.uid,
          email: identifier,
          username,
          role,
          createdAt: new Date().toISOString(),
          ...(role === 'vendor' ? { name } : {}),
          ...(role === 'advertiser' ? { companyName, personName } : {})
        };

        await setDoc(doc(db, 'users', user.uid), userData);
        onLogin(identifier, role);
      } else {
        // --- SIGN IN WITH EMAIL OR USERNAME ---
        let targetEmail = identifier;

        if (!identifier.includes('@')) {
          const q = query(collection(db, 'users'), where('username', '==', identifier));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            setErrorMsg('Username not found. Try logging in with your Email ID.');
            setLoading(false);
            return;
          }
          
          targetEmail = querySnapshot.docs[0].data().email;
        }

        const userCredential = await signInWithEmailAndPassword(auth, targetEmail, password);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.role !== role) {
            setErrorMsg(`Access Denied: This account belongs to the "${userData.role.toUpperCase()}" portal, not "${role.toUpperCase()}".`);
            auth.signOut();
            setLoading(false);
            return;
          }
        }

        onLogin(targetEmail, role);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm placeholder:text-slate-400";
  const labelClasses = "block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden font-sans text-slate-900 py-12">
      
      {/* Landing Page Style Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50"></div>

      {/* BACK BUTTON */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors z-20 bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          ⬅️ Back to Home
        </button>
      )}

      {/* Header & Hackathon Badge */}
      <div className="z-10 mb-8 text-center flex flex-col items-center mt-12 md:mt-0">
        <span className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs tracking-wide uppercase shadow-sm mb-6">
          🚀 Fusionix26 Hackathon
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
          Insta<span className="text-indigo-600">Biz</span> Portal
        </h1>
        <p className="text-slate-500 mt-3 font-medium tracking-wide">Multi-Tenant Authentication</p>
      </div>

      {/* Clean Light-Mode Login Card */}
      <div className="z-10 w-full max-w-md p-8 rounded-3xl bg-white border border-slate-100 shadow-2xl relative">
        
        {/* Role Tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1.5 mb-8 border border-slate-200/60">
          {['vendor', 'advertiser', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); setIsRegistering(false); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${
                role === r
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 capitalize">{role} Portal</h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegistering ? 'Create your new account credentials' : 'Sign in using your Username or Email & Password'}
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-semibold leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* VENDOR REGISTRATION FIELDS */}
          {isRegistering && role === 'vendor' && (
            <>
              <div>
                <label className={labelClasses}>Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Satya Hemesh" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Username</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. satya_vendor" className={inputClasses} />
              </div>
            </>
          )}

          {/* ADVERTISER REGISTRATION FIELDS */}
          {isRegistering && role === 'advertiser' && (
            <>
              <div>
                <label className={labelClasses}>Company Name</label>
                <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. AdNetworks Inc." className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Person Name</label>
                <input type="text" required value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="e.g. Manager Name" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Username</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. adv_lead" className={inputClasses} />
              </div>
            </>
          )}

          {/* SHARED LOGIN / EMAIL FIELD */}
          <div>
            <label className={labelClasses}>
              {isRegistering ? 'Email ID (for Authentication)' : 'Login ID (Email or Username)'}
            </label>
            <input
              type={isRegistering ? 'email' : 'text'}
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={isRegistering ? 'name@domain.com' : 'Enter username or email...'}
              className={inputClasses}
            />
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <label className={labelClasses}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClasses}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/30 flex justify-center items-center gap-2 text-sm tracking-wide disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : (isRegistering ? 'Register Account 🚀' : 'Authenticate ⚡')}
          </button>
        </form>

        {/* TOGGLE REGISTRATION */}
        {role !== 'admin' && (
          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }} 
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {isRegistering ? 'Already registered? Sign in here' : "Don't have an account? Register newly"}
            </button>
          </div>
        )}
      </div>

      {/* TEAM */}
      <div className="mt-12 z-10 text-center w-full text-[11px] font-semibold text-slate-400 tracking-widest uppercase">
        Developed By <span className="text-slate-600 font-black">Quad Core Team</span>
      </div>
    </div>
  );
}