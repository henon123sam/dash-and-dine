'use client';

import React, { useState } from 'react';

// Mock database containing existing registered emails
const mockDatabaseAccounts = [
  'henon123@gmail.com',
  'testuser@example.com',
  'abebe@gmail.com',
];

export default function AuthPage({ onLoggedIn }: { onLoggedIn: (userEmail: string) => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'input' | 'signup_form' | 'password' | 'otp'>('input');

  // Form fields
  const [identifier, setIdentifier] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Dedicated Create Account Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+251');
  const [phone, setPhone] = useState('');
  
  const [signInPassword, setSignInPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const isEmail = (val: string) => val.includes('@');

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (mockDatabaseAccounts.includes(val.trim().toLowerCase())) {
      setEmailError('Email already has an account. Would you like to sign in instead?');
    } else {
      setEmailError('');
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      alert('Please enter your email or phone number.');
      return;
    }

    if (isSignUp) {
      setStep('signup_form');
    } else {
      if (isEmail(identifier)) {
        setStep('password');
      } else {
        setStep('otp');
      }
    }
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) {
      return;
    }
    if (!fullName || !email || !password || !phone) {
      alert('Please fill out all fields completely.');
      return;
    }

    mockDatabaseAccounts.push(email.trim().toLowerCase());
    alert(`Account successfully created for ${fullName} with ${countryCode} ${phone}!`);
    onLoggedIn(email);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoggedIn(identifier);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full bg-neutral-900 rounded-3xl p-8 border border-red-600/40 shadow-2xl">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-red-600 tracking-wider mb-1">DINE & DASH</h1>
          <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">Speed & Flavor Delivered</p>
        </div>

        {/* Toggle Bar: Sign In vs Create Account */}
        <div className="flex bg-black p-1 rounded-full mb-6 border border-neutral-800">
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-bold rounded-full transition ${!isSignUp ? 'bg-red-600 text-white shadow-lg' : 'text-neutral-400'}`}
            onClick={() => { setIsSignUp(false); setStep('input'); setEmailError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-bold rounded-full transition ${isSignUp ? 'bg-red-600 text-white shadow-lg' : 'text-neutral-400'}`}
            onClick={() => { setIsSignUp(true); setStep('signup_form'); setEmailError(''); }}
          >
            Create Account
          </button>
        </div>

        {/* CREATE ACCOUNT FLOW */}
        {isSignUp && (
          <form onSubmit={handleCreateAccountSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder="Abebe Kebede"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">Email Address</label>
              </div>
              <input
                type="email"
                required
                className={`w-full px-3.5 py-2.5 bg-black border rounded-xl focus:outline-none focus:ring-2 text-white text-sm ${
                  emailError ? 'border-red-600 ring-2 ring-red-600/50' : 'border-neutral-800 focus:ring-red-600'
                }`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
              {emailError && (
                <div className="mt-1.5 p-2.5 bg-red-950/60 border border-red-900 rounded-xl flex items-center justify-between">
                  <span className="text-[11px] text-red-200 font-medium leading-tight">{emailError}</span>
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setStep('input'); setIdentifier(email); }}
                    className="text-[11px] font-extrabold text-red-400 hover:text-red-300 underline ml-2 whitespace-nowrap"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">Phone Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-2.5 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm font-semibold"
                >
                  <option value="+251">+251 (ET)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+254">+254 (KE)</option>
                  <option value="+971">+971 (UAE)</option>
                </select>
                <input
                  type="text"
                  required
                  className="flex-1 px-3.5 py-2.5 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                  placeholder="982803344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={Boolean(emailError)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-extrabold rounded-xl transition shadow-lg text-sm mt-3"
            >
              Complete Account Creation
            </button>
          </form>
        )}

        {/* SIGN IN FLOW */}
        {!isSignUp && step === 'input' && (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                Email or Phone Number
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder="name@example.com or phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-lg text-sm"
            >
              Continue
            </button>
          </form>
        )}

        {!isSignUp && step === 'password' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-300 font-semibold truncate max-w-[220px]">{identifier}</span>
              <button 
                type="button" 
                onClick={() => setStep('input')} 
                className="text-xs text-red-500 font-bold hover:underline"
              >
                Switch
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder="••••••••"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-lg text-sm"
            >
              Sign In
            </button>
          </form>
        )}

        {!isSignUp && step === 'otp' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-300 font-semibold">Code sent to {identifier}</span>
              <button 
                type="button" 
                onClick={() => setStep('input')} 
                className="text-xs text-red-500 font-bold hover:underline"
              >
                Edit
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">Enter 4-Digit Code</label>
              <input
                type="text"
                maxLength={4}
                required
                className="w-full px-4 py-3 text-center tracking-widest text-xl font-black bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                placeholder="1234"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-lg text-sm"
            >
              Verify & Sign In
            </button>
          </form>
        )}

      </div>
    </div>
  );
}