'use client';

import React, { useState, useEffect } from 'react';

interface UserAccount {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  countryCode: string;
}

interface FoodItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

const mockFoodMenu: FoodItem[] = [
  { id: 1, name: 'Doro Wat Special', category: 'Traditional', price: 450, image: '🍛', description: 'Traditional spicy chicken stew with hard-boiled egg and injera.' },
  { id: 2, name: 'Kitfo Special', category: 'Traditional', price: 520, image: '🥩', description: 'Minced lean beef seasoned with mitmita and clarified butter.' },
  { id: 3, name: 'Dash Supreme Burger', category: 'Fast Food', price: 380, image: '🍔', description: 'Double beef patty, melted cheddar, crispy bacon, and signature sauce.' },
  { id: 4, name: 'Spicy Pepperoni Pizza', category: 'Fast Food', price: 600, image: '🍕', description: 'Loaded with double pepperoni, mozzarella cheese, and chili flakes.' },
  { id: 5, name: 'Fresh Avocado Juice', category: 'Drinks', price: 150, image: '🥑', description: 'Layered fresh fruit smoothie with mango and strawberry.' },
];

export default function DineAndDashApp() {
  // Database synchronization using localStorage
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('dine_and_dash_accounts');
    if (savedAccounts) {
      try {
        setAccounts(JSON.parse(savedAccounts));
      } catch (e) {
        setAccounts([]);
      }
    } else {
      const initialAccounts: UserAccount[] = [
        { email: 'henon123@gmail.com', password: 'password123', fullName: 'Henon Samuel', phone: '982803344', countryCode: '+251' }
      ];
      localStorage.setItem('dine_and_dash_accounts', JSON.stringify(initialAccounts));
      setAccounts(initialAccounts);
    }

    const active = localStorage.getItem('dine_and_dash_current_user');
    if (active) setCurrentUser(active);
  }, []);

  const saveNewAccount = (newAcc: UserAccount) => {
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    localStorage.setItem('dine_and_dash_accounts', JSON.stringify(updated));
  };

  const updatePasswordInDb = (email: string, newPass: string) => {
    const updated = accounts.map(acc => acc.email.toLowerCase() === email.toLowerCase() ? { ...acc, password: newPass } : acc);
    setAccounts(updated);
    localStorage.setItem('dine_and_dash_accounts', JSON.stringify(updated));
  };

  const handleLoginSuccess = (email: string) => {
    setCurrentUser(email);
    localStorage.setItem('dine_and_dash_current_user', email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dine_and_dash_current_user');
  };

  // Auth screen states
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'input' | 'signup_form' | 'password' | 'otp' | 'forgot_email' | 'forgot_code' | 'forgot_new_pass'>('input');
  const [identifier, setIdentifier] = useState('');
  const [emailError, setEmailError] = useState('');

  // Create account inputs
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+251');
  const [phone, setPhone] = useState('');

  // Sign in states
  const [signInPassword, setSignInPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Forgot password states
  const [forgotEmailInput, setForgotEmailInput] = useState('');
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const generatedResetCode = '7777';

  const isEmail = (val: string) => val.includes('@');

  const handleSignupEmailChange = (val: string) => {
    setSignupEmail(val);
    const found = accounts.find(acc => acc.email.toLowerCase() === val.trim().toLowerCase());
    if (found) {
      setEmailError('Email already has an account. Would you like to sign in instead?');
    } else {
      setEmailError('');
    }
  };

  const handleInitialSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      alert('Please enter your email or phone number.');
      return;
    }

    if (isEmail(identifier)) {
      const exists = accounts.find(acc => acc.email.toLowerCase() === identifier.trim().toLowerCase());
      if (!exists) {
        alert('No account found with this email. Please create an account first.');
        setIsSignUp(true);
        setSignupEmail(identifier);
        setStep('signup_form');
        return;
      }
      setStep('password');
    } else {
      alert(`SMS verification code (Mock: 1234) sent to phone: ${identifier}`);
      setStep('otp');
    }
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) return;
    if (!fullName || !signupEmail || !signupPassword || !phone) {
      alert('Please fill out all fields completely.');
      return;
    }

    const newAccount: UserAccount = {
      email: signupEmail.trim().toLowerCase(),
      password: signupPassword,
      fullName,
      phone,
      countryCode,
    };

    saveNewAccount(newAccount);
    alert(`Account successfully created for ${fullName}! Please sign in now.`);
    setIsSignUp(false);
    setIdentifier(signupEmail);
    setStep('password');
    setFullName('');
    setSignupEmail('');
    setSignupPassword('');
    setPhone('');
  };

  const handlePasswordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accounts.find(acc => acc.email.toLowerCase() === identifier.trim().toLowerCase());
    if (account && account.password !== signInPassword) {
      alert('Incorrect password. Please try again or use Forgot Password.');
      return;
    }
    handleLoginSuccess(identifier);
  };

  const handleOtpSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234' && otpCode.length !== 4) {
      alert('Please enter a valid 4-digit verification code (e.g., 1234).');
      return;
    }
    handleLoginSuccess(identifier);
  };

  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accounts.find(acc => acc.email.toLowerCase() === forgotEmailInput.trim().toLowerCase());
    if (!account) {
      alert('No registered account found with this email address.');
      return;
    }
    alert(`Password reset code sent to ${forgotEmailInput}! (Demo code is: 7777)`);
    setStep('forgot_code');
  };

  const handleVerifyResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCodeInput !== generatedResetCode) {
      alert('Invalid code. Please enter the correct 4-digit code sent to your email.');
      return;
    }
    setStep('forgot_new_pass');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    updatePasswordInDb(forgotEmailInput, newPasswordInput);
    alert('Password successfully updated! You can now sign in with your new password.');
    setIsSignUp(false);
    setIdentifier(forgotEmailInput);
    setStep('password');
    setForgotEmailInput('');
    setResetCodeInput('');
    setNewPasswordInput('');
  };

  // Main Menu Dashboard States
  const [mainTab, setMainTab] = useState<'dine' | 'dash'>('dine');
  const [cart, setCart] = useState<FoodItem[]>([]);
  
  // Dash Trip Map States
  const [pickupLocation, setPickupLocation] = useState('Bole Medhanialem, Addis Ababa');
  const [destinationLocation, setDestinationLocation] = useState('Piazza, Addis Ababa');
  const [tripActive, setTripActive] = useState(false);

  // --- RENDER: AUTH PAGE (Red & White Theme) ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-neutral-900 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl relative">
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-red-600 tracking-wider mb-1">DINE & DASH</h1>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest">Speed & Flavor Delivered</p>
          </div>

          {step !== 'forgot_email' && step !== 'forgot_code' && step !== 'forgot_new_pass' && (
            <div className="flex bg-neutral-100 p-1 rounded-full mb-6 border border-neutral-200">
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-bold rounded-full transition ${!isSignUp ? 'bg-red-600 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'}`}
                onClick={() => { setIsSignUp(false); setStep('input'); setEmailError(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-bold rounded-full transition ${isSignUp ? 'bg-red-600 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'}`}
                onClick={() => { setIsSignUp(true); setStep('signup_form'); setEmailError(''); }}
              >
                Create Account
              </button>
            </div>
          )}

          {isSignUp && step === 'signup_form' && (
            <form onSubmit={handleCreateAccountSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                  placeholder="Abebe Kebede"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 text-neutral-900 text-sm ${
                    emailError ? 'border-red-600 ring-2 ring-red-600/30' : 'border-neutral-300 focus:ring-red-600'
                  }`}
                  placeholder="name@example.com"
                  value={signupEmail}
                  onChange={(e) => handleSignupEmailChange(e.target.value)}
                />
                {emailError && (
                  <div className="mt-1.5 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                    <span className="text-[11px] text-red-700 font-medium leading-tight">{emailError}</span>
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(false); setStep('password'); setIdentifier(signupEmail); }}
                      className="text-[11px] font-extrabold text-red-600 hover:underline ml-2 whitespace-nowrap"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm font-semibold"
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
                    className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                    placeholder="982803344"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={Boolean(emailError)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-extrabold rounded-xl transition shadow-md text-sm mt-3"
              >
                Complete Account Creation
              </button>
            </form>
          )}

          {!isSignUp && step === 'input' && (
            <form onSubmit={handleInitialSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                  placeholder="name@example.com or phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
              >
                Continue
              </button>
            </form>
          )}

          {!isSignUp && step === 'password' && (
            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-700 font-semibold truncate max-w-[220px]">{identifier}</span>
                <button 
                  type="button" 
                  onClick={() => setStep('input')} 
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Switch
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setStep('forgot_email'); setForgotEmailInput(isEmail(identifier) ? identifier : ''); }}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
              >
                Sign In
              </button>
            </form>
          )}

          {!isSignUp && step === 'otp' && (
            <form onSubmit={handleOtpSignIn} className="space-y-4">
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-700 font-semibold">SMS code sent to {identifier}</span>
                <button 
                  type="button" 
                  onClick={() => setStep('input')} 
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Edit
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Enter 4-Digit Code</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  className="w-full px-4 py-3 text-center tracking-widest text-xl font-black bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900"
                  placeholder="1234"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
                <p className="text-[11px] text-neutral-500 mt-1 text-center">Demo code: 1234</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
              >
                Verify & Sign In
              </button>
            </form>
          )}

          {step === 'forgot_email' && (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-sm font-bold text-neutral-800">Reset Your Password</h2>
                <p className="text-xs text-neutral-500 mt-1">Enter your registered email address for the verification code.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                  placeholder="name@example.com"
                  value={forgotEmailInput}
                  onChange={(e) => setForgotEmailInput(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
              >
                Send Reset Code
              </button>

              <button
                type="button"
                onClick={() => setStep('password')}
                className="w-full py-2 text-xs text-neutral-600 hover:text-neutral-900 font-bold text-center block"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {step === 'forgot_code' && (
            <form onSubmit={handleVerifyResetCode} className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-sm font-bold text-neutral-800">Enter Verification Code</h2>
                <p className="text-xs text-neutral-500 mt-1">We sent a 4-digit code to {forgotEmailInput}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">4-Digit Code</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  className="w-full px-4 py-3 text-center tracking-widest text-xl font-black bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900"
                  placeholder="7777"
                  value={resetCodeInput}
                  onChange={(e) => setResetCodeInput(e.target.value)}
                />
                <p className="text-[11px] text-neutral-500 mt-1 text-center">Demo code: 7777</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
              >
                Verify Code
              </button>
            </form>
          )}

          {step === 'forgot_new_pass' && (
            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-sm font-bold text-neutral-800">Create New Password</h2>
                <p className="text-xs text-neutral-500 mt-1">Enter your new secure password below.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                  placeholder="At least 6 characters"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
              >
                Reset Password & Sign In
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // --- RENDER: MAIN DASHBOARD (DINE & DASH MENU WITH FOOD & LIVE MAP) ---
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans flex flex-col">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-black text-red-600 tracking-wider">DINE & DASH</h1>
          <span className="text-xs bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full border border-red-200">
            Welcome, {currentUser}
          </span>
        </div>

        {/* Central Mode Switcher: DINE (Food) vs DASH (Trip Map) */}
        <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200">
          <button
            onClick={() => setMainTab('dine')}
            className={`px-6 py-2 text-xs font-extrabold rounded-full transition ${mainTab === 'dine' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            🍽️ Dine (Food)
          </button>
          <button
            onClick={() => setMainTab('dash')}
            className={`px-6 py-2 text-xs font-extrabold rounded-full transition ${mainTab === 'dash' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            🗺️ Dash (Live Map & Trips)
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-200 transition"
        >
          Sign Out
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
        
        {/* --- DINE SECTION (FOOD ORDERING) --- */}
        {mainTab === 'dine' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-neutral-900">Explore Delicious Menu</h2>
                <p className="text-xs text-neutral-500 font-medium">Order food instantly delivered with lightning speed.</p>
              </div>
              <div className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md">
                Cart Items: {cart.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockFoodMenu.map((item) => (
                <div key={item.id} className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-3 text-center bg-neutral-50 py-4 rounded-2xl">{item.image}</div>
                    <span className="text-[10px] font-extrabold uppercase text-red-600 tracking-wider bg-red-50 px-2.5 py-1 rounded-md">{item.category}</span>
                    <h3 className="font-bold text-lg text-neutral-900 mt-2">{item.name}</h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-neutral-100">
                    <span className="font-black text-neutral-900 text-base">{item.price} ETB</span>
                    <button
                      onClick={() => {
                        setCart([...cart, item]);
                        alert(`Added ${item.name} to your food order!`);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition"
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- DASH SECTION (LIVE MAP & TRIPS) --- */}
        {mainTab === 'dash' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Live Trip & Location Map</h2>
              <p className="text-xs text-neutral-500 font-medium">Set your current pickup location and destination to dash anywhere.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Trip Controls Panel */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-neutral-900 text-sm uppercase tracking-wider">Plan Your Dash Trip</h3>
                
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1 uppercase">Current Location</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    placeholder="Enter pickup location"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1 uppercase">Destination</label>
                  <input
                    type="text"
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    placeholder="Enter destination"
                  />
                </div>

                <button
                  onClick={() => {
                    setTripActive(true);
                    alert(`Dash trip requested from "${pickupLocation}" to "${destinationLocation}"! Driver dispatched.`);
                  }}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs shadow-md transition"
                >
                  Request Dash Ride Now
                </button>

                {tripActive && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl">
                    <p className="text-xs font-bold text-red-700">🚗 Driver on the way!</p>
                    <p className="text-[11px] text-neutral-600 mt-0.5">Heading to {destinationLocation}</p>
                  </div>
                )}
              </div>

              {/* Big Live Map Simulation View */}
              <div className="lg:col-span-2 bg-neutral-900 rounded-3xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[420px] border border-neutral-800">
                
                {/* Map Grid Background Effect */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:24px_24px]"></div>

                {/* Map Header Overlay */}
                <div className="relative z-10 flex items-center justify-between bg-neutral-950/80 backdrop-blur border border-neutral-800 p-3.5 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Live GPS Radar Active</span>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">Addis Ababa Metro Area</span>
                </div>

                {/* Visual Map Pin Simulation */}
                <div className="relative z-10 my-auto text-center py-12 space-y-4">
                  <div className="inline-block p-4 bg-red-600 text-white rounded-3xl shadow-2xl text-2xl font-black animate-bounce">
                    📍
                  </div>
                  <div className="bg-black/80 backdrop-blur border border-neutral-800 p-4 rounded-2xl max-w-sm mx-auto shadow-xl">
                    <p className="text-xs text-neutral-400 font-bold uppercase">Route Status</p>
                    <p className="text-sm font-extrabold text-white mt-1">{pickupLocation} ➔ {destinationLocation}</p>
                    <p className="text-xs text-red-500 font-bold mt-2">{tripActive ? 'Estimated Arrival: 12 mins' : 'Ready to start trip'}</p>
                  </div>
                </div>

                {/* Map Footer Controls Overlay */}
                <div className="relative z-10 flex justify-between items-center bg-neutral-950/80 backdrop-blur border border-neutral-800 px-4 py-2.5 rounded-2xl text-xs text-neutral-300 font-semibold">
                  <span>Zoom: 100%</span>
                  <span className="text-red-500 font-bold">Dine & Dash Live Navigation</span>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}