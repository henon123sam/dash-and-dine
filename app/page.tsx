'use client';

import React, { useState } from 'react';

// --- Types ---
interface FoodItem {
  name: string;
  price: number;
  category: string;
  restaurant: string;
  branch: string;
}

interface CartItemEntry {
  item: FoodItem;
  quantity: number;
}

interface RestaurantBranch {
  name: string;
  branch: string;
  image: string;
  cuisine: string;
  rating: number;
}

// --- Restaurants List ---
const restaurantsList: RestaurantBranch[] = [
  { name: 'Simple Bistro', branch: 'Bole Road', image: '🍔', cuisine: 'Burgers & Chicken', rating: 4.8 },
  { name: 'Simple Bistro', branch: 'Kazanchis', image: '🍔', cuisine: 'Burgers & Chicken', rating: 4.6 },
  { name: 'Smash Burger', branch: 'Bole Medhanialem', image: '🔥', cuisine: 'Smash Burgers', rating: 4.9 },
];

// --- Combined Menu Data ---
const globalMenu: FoodItem[] = [
  // Simple Bistro | Bole Road
  { name: 'Single Chicken Junkie', price: 1414.5, category: 'Chicken', restaurant: 'Simple Bistro', branch: 'Bole Road' },
  { name: 'Simple Special Burger', price: 1627.25, category: 'Burger', restaurant: 'Simple Bistro', branch: 'Bole Road' },
  { name: 'Chicken Junkie', price: 1874.5, category: 'Chicken', restaurant: 'Simple Bistro', branch: 'Bole Road' },
  { name: 'Chicken Burger', price: 1242.0, category: 'Chicken', restaurant: 'Simple Bistro', branch: 'Bole Road' },
  { name: 'Swiss Style', price: 1184.5, category: 'Burger', restaurant: 'Simple Bistro', branch: 'Bole Road' },
  { name: 'Double Saucy', price: 1627.25, category: 'Burger', restaurant: 'Simple Bistro', branch: 'Bole Road' },

  // Simple Bistro | Kazanchis
  { name: 'Kazanchis Special Burger', price: 1550.0, category: 'Burger', restaurant: 'Simple Bistro', branch: 'Kazanchis' },
  { name: 'Crispy Wings Meal', price: 1320.0, category: 'Chicken', restaurant: 'Simple Bistro', branch: 'Kazanchis' },

  // Smash Burger | Bole Medhanialem
  { name: 'Malmö Smash', price: 730.0, category: 'Smash Burger', restaurant: 'Smash Burger', branch: 'Bole Medhanialem' },
  { name: 'BBQ Triple Cheese Burger', price: 799.0, category: 'Smash Burger', restaurant: 'Smash Burger', branch: 'Bole Medhanialem' },
  { name: 'Chili Burger', price: 630.0, category: 'Smash Burger', restaurant: 'Smash Burger', branch: 'Bole Medhanialem' },
  { name: 'Coca Cola Soft Drink', price: 75.0, category: 'Drinks', restaurant: 'Smash Burger', branch: 'Bole Medhanialem' },
];

export default function DineAndDashApp() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  if (!loggedInUser) {
    return <AuthScreen onLoggedIn={(userHandle) => setLoggedInUser(userHandle)} />;
  }

  return <MainDashboardScreen userEmail={loggedInUser} onSignOut={() => setLoggedInUser(null)} />;
}

// --- Authentication Component with Authentic Google Selector & Black/Red Theme ---
function AuthScreen({ onLoggedIn }: { onLoggedIn: (identifier: string) => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'input' | 'password' | 'otp' | 'forgot' | 'signup_details' | 'google_picker'>('input');
  
  // Form fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const isEmail = (val: string) => val.includes('@');

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      alert('Please enter your email or phone number.');
      return;
    }

    if (isSignUp) {
      if (!isEmail(identifier)) {
        alert('For account creation, please enter a valid email address.');
        return;
      }
      setStep('signup_details');
    } else {
      if (isEmail(identifier)) {
        setStep('password');
      } else {
        setStep('otp');
      }
    }
  };

  const handleCompleteSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password || !signupPhone) {
      alert('Please fill out all fields to create your account.');
      return;
    }
    alert(`Account successfully created for ${name}!`);
    onLoggedIn(identifier);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'otp') {
      if (otpCode.length < 4) {
        alert('Please enter a valid 4-digit verification code.');
        return;
      }
      onLoggedIn(identifier);
    } else if (step === 'password') {
      if (!password) {
        alert('Please enter your password.');
        return;
      }
      onLoggedIn(identifier);
    }
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Password reset instructions sent to ${identifier}`);
    setStep('input');
  };

  // Simulated Google Account Picker (like native Google OAuth chooser)
  const handleGoogleClick = () => {
    setStep('google_picker');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-gray-100">
      <div className="max-w-md w-full bg-gray-900 rounded-3xl shadow-2xl p-8 border border-red-600/30">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-red-600 tracking-wider mb-1">DINE & DASH</h1>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Speed & Flavor Delivered</p>
        </div>

        {/* Tab switcher */}
        {step !== 'google_picker' && (
          <div className="flex bg-gray-950 p-1 rounded-full mb-6 border border-gray-800">
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-full transition ${!isSignUp ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400'}`}
              onClick={() => { setIsSignUp(false); setStep('input'); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-full transition ${isSignUp ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400'}`}
              onClick={() => { setIsSignUp(true); setStep('input'); }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* AUTHENTIC GOOGLE ACCOUNT CHOOSER POPUP VIEW */}
        {step === 'google_picker' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center pb-2 border-b border-gray-800">
              <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.33 7.22 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.82 0 12s.43 3.88 1.18 5.4l4.09-3.16z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.67 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <h2 className="text-base font-bold text-white">Choose an account</h2>
              <p className="text-xs text-gray-400">to continue to Dine & Dash</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onLoggedIn('frequent.user@gmail.com')}
                className="w-full flex items-center gap-3 p-3 bg-gray-950 hover:bg-gray-800 rounded-2xl border border-gray-800 transition text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  F
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-white group-hover:text-red-500 transition">Frequent User</p>
                  <p className="text-xs text-gray-400 truncate">frequent.user@gmail.com</p>
                </div>
              </button>

              <button
                onClick={() => onLoggedIn('secondary.account@gmail.com')}
                className="w-full flex items-center gap-3 p-3 bg-gray-950 hover:bg-gray-800 rounded-2xl border border-gray-800 transition text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  S
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-white group-hover:text-red-500 transition">Secondary Account</p>
                  <p className="text-xs text-gray-400 truncate">secondary.account@gmail.com</p>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-white font-bold transition"
            >
              Cancel
            </button>
          </div>
        )}

        {/* STEP 1: INITIAL INPUT */}
        {step === 'input' && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">
                {isSignUp ? 'Email Address' : 'Email or Phone Number'}
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder={isSignUp ? 'name@example.com' : 'name@example.com or +251...'}
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

        {/* SIGN UP DETAILS VIEW */}
        {step === 'signup_details' && (
          <form onSubmit={handleCompleteSignUp} className="space-y-4">
            <div className="bg-red-950/40 p-3 rounded-xl border border-red-900/50 flex items-center justify-between mb-2">
              <span className="text-xs text-red-200 font-semibold truncate max-w-[220px]">{identifier}</span>
              <button 
                type="button" 
                onClick={() => setStep('input')} 
                className="text-xs text-red-400 font-bold hover:underline"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder="Abebe Kebede"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Phone Number</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder="+251911223344"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-lg text-sm"
            >
              Complete Account Creation
            </button>
          </form>
        )}

        {/* STEP 2A: EMAIL PASSWORD MENU */}
        {step === 'password' && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="bg-red-950/40 p-3 rounded-xl border border-red-900/50 flex items-center justify-between mb-2">
              <span className="text-xs text-red-200 font-semibold truncate max-w-[220px]">{identifier}</span>
              <button 
                type="button" 
                onClick={() => setStep('input')} 
                className="text-xs text-red-400 font-bold hover:underline"
              >
                Switch
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setStep('forgot')}
                  className="text-xs text-red-500 font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-lg text-sm"
            >
              Sign In
            </button>
          </form>
        )}

        {/* STEP 2B: PHONE SMS OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="bg-red-950/40 p-3 rounded-xl border border-red-900/50 flex items-center justify-between mb-2">
              <span className="text-xs text-red-200 font-semibold">SMS code sent to {identifier}</span>
              <button 
                type="button" 
                onClick={() => setStep('input')} 
                className="text-xs text-red-400 font-bold hover:underline"
              >
                Edit
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Enter 4-Digit Verification Code</label>
              <input
                type="text"
                maxLength={4}
                required
                className="w-full px-4 py-3 text-center tracking-widest text-xl font-black bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
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

        {/* FORGOT PASSWORD VIEW */}
        {step === 'forgot' && (
          <form onSubmit={handleSendResetLink} className="space-y-4">
            <p className="text-xs text-gray-400 mb-2">
              Enter your email address and we&apos;ll send you recovery instructions.
            </p>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder="user@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-lg text-sm"
            >
              Send Reset Instructions
            </button>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="w-full py-2 text-xs text-gray-500 font-bold hover:text-gray-300"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {step === 'input' && (
          <>
            <div className="mt-6 text-center text-xs text-gray-500 uppercase tracking-widest font-semibold">Or continue instantly</div>
            
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleGoogleClick}
                className="flex-1 py-3 px-3 bg-gray-950 border border-gray-800 rounded-xl font-bold text-gray-200 hover:bg-gray-800 transition flex items-center justify-center gap-2 text-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.33 7.22 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.82 0 12s.43 3.88 1.18 5.4l4.09-3.16z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.67 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
                Google
              </button>
              
              <button
                type="button"
                onClick={() => onLoggedIn('Guest User')}
                className="flex-1 py-3 px-3 bg-gray-950 border border-gray-800 rounded-xl font-bold text-gray-200 hover:bg-gray-800 transition flex items-center justify-center gap-2 text-xs"
              >
                👤 Guest Mode
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Main Dashboard Component with Dine & Dash Black/Red Identity & Branch Selection ---
function MainDashboardScreen({ userEmail, onSignOut }: { userEmail: string; onSignOut: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<{ name: string; branch: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userCart, setUserCart] = useState<Record<string, CartItemEntry>>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Bole Road, Addis Ababa');
  const [paymentMethod, setPaymentMethod] = useState('Telebirr');
  const [showAccountModal, setShowAccountModal] = useState(false);

  const isGuest = userEmail === 'Guest User';

  // Filter restaurants/branches based on search query
  const filteredRestaurants = restaurantsList.filter(
    (r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['All', 'Burger', 'Chicken', 'Smash Burger', 'Drinks'];

  const displayedMenu = selectedBranch
    ? globalMenu.filter(
        (item) => item.restaurant === selectedBranch.name && item.branch === selectedBranch.branch
      )
    : [];

  const finalFilteredMenu = selectedCategory === 'All'
    ? displayedMenu
    : displayedMenu.filter((item) => item.category === selectedCategory);

  const updateQuantity = (item: FoodItem, delta: number) => {
    setUserCart((prev) => {
      const updated = { ...prev };
      const cartKey = `${item.restaurant}-${item.branch}-${item.name}`;
      if (updated[cartKey]) {
        updated[cartKey].quantity += delta;
        if (updated[cartKey].quantity <= 0) {
          delete updated[cartKey];
        }
      } else if (delta > 0) {
        updated[cartKey] = { item, quantity: 1 };
      }
      return updated;
    });
  };

  const totalItemCount = Object.values(userCart).reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotalPrice = Object.values(userCart).reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const kitchenPrepTax = subtotalPrice * 0.10;
  const deliveryFee = 150.0;
  const finalTotalPrice = subtotalPrice + kitchenPrepTax + (totalItemCount > 0 ? deliveryFee : 0);

  const handleConfirmOrder = () => {
    alert(`Order submitted successfully! Sent to kitchen and delivered to: ${deliveryAddress}`);
    setUserCart({});
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-32 text-gray-100">
      {/* Header with Black & Red Theme */}
      <header className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto border-b border-gray-800 bg-gray-900 shadow-lg sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-black text-red-600 tracking-wider cursor-pointer" onClick={() => setSelectedBranch(null)}>
            DINE & DASH 🚀
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {selectedBranch ? `${selectedBranch.name} — ${selectedBranch.branch}` : 'Bole & Kazanchis Express Delivery'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (isGuest) setShowAccountModal(true); }}
            className={`text-left px-3 py-1.5 rounded-xl border transition ${
              isGuest ? 'bg-red-950/40 border-red-600/40 hover:bg-red-900/40 cursor-pointer' : 'bg-gray-950 border-gray-800 cursor-default'
            }`}
          >
            <p className="text-[10px] text-gray-400">Logged in as</p>
            <p className="text-xs font-bold text-gray-200 flex items-center gap-1">
              {userEmail} {isGuest && <span className="text-[10px] text-red-500 font-extrabold underline">⚠️ No Account</span>}
            </p>
          </button>

          <button
            onClick={onSignOut}
            className="text-xs font-bold text-red-400 bg-red-950/60 hover:bg-red-900/60 px-3 py-2 rounded-xl transition border border-red-900/50"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Guest Account Modal */}
      {showAccountModal && isGuest && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-gray-900 max-w-sm w-full rounded-3xl p-6 shadow-2xl text-center border border-red-600/30">
            <div className="w-12 h-12 bg-red-950 rounded-full flex items-center justify-center mx-auto mb-3 text-xl text-red-500 border border-red-900">
              👤
            </div>
            <h3 className="text-lg font-black text-white mb-1">You don&apos;t have an account yet!</h3>
            <p className="text-xs text-gray-400 mb-6">
              You are browsing as a Guest. Sign in or create a full account to save addresses and track your orders seamlessly.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAccountModal(false)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl transition"
              >
                Keep Browsing
              </button>
              <button
                onClick={onSignOut}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition shadow-md"
              >
                Sign In Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: RESTAURANT & BRANCH SEARCH */}
      {!selectedBranch ? (
        <main className="max-w-4xl mx-auto px-6 py-6 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search restaurants or branch (e.g. Simple Bistro, Bole)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3.5 pl-11 bg-gray-900 border border-gray-800 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-inner"
            />
            <span className="absolute left-4 top-4 text-gray-400">🔍</span>
          </div>

          <div>
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">Available Restaurants & Branches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRestaurants.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedBranch({ name: r.name, branch: r.branch })}
                  className="bg-gray-900 p-5 rounded-3xl border border-gray-800 hover:border-red-600 transition cursor-pointer shadow-lg group flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-950 rounded-2xl flex items-center justify-center text-2xl border border-gray-800 group-hover:scale-105 transition">
                      {r.image}
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base group-hover:text-red-500 transition">{r.name}</h3>
                      <p className="text-xs font-semibold text-red-400 mt-0.5">📍 Branch: {r.branch}</p>
                      <p className="text-[11px] text-gray-500 mt-1">{r.cuisine}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-red-950/60 text-red-400 text-xs font-bold rounded-lg border border-red-900/50">
                      ★ {r.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* VIEW 2: BRANCH MENU & CATEGORIES */
        <main className="max-w-4xl mx-auto px-6 py-4 space-y-4">
          <button
            onClick={() => setSelectedBranch(null)}
            className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1 mb-2"
          >
            ← Back to Restaurants
          </button>

          {/* Category Pills */}
          <div className="overflow-x-auto flex gap-2 py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition shadow-xs ${
                  selectedCategory === cat ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {finalFilteredMenu.map((item) => {
              const cartKey = `${item.restaurant}-${item.branch}-${item.name}`;
              const currentQty = userCart[cartKey]?.quantity || 0;
              return (
                <div key={cartKey} className="flex items-center justify-between bg-gray-900 p-4 rounded-3xl shadow-sm border border-gray-800 hover:border-gray-700 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-950 rounded-2xl flex items-center justify-center text-red-500 font-bold text-xl border border-gray-800">
                      🍔
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{item.name}</h3>
                      <span className="inline-block px-2 py-0.5 bg-gray-950 text-gray-400 text-[10px] font-semibold rounded-md mt-0.5 border border-gray-800">
                        {item.restaurant} ({item.branch})
                      </span>
                      <p className="text-sm font-black text-red-500 mt-1">{item.price.toFixed(2)} Br</p>
                    </div>
                  </div>

                  {currentQty === 0 ? (
                    <button
                      onClick={() => updateQuantity(item, 1)}
                      className="px-5 py-2.5 border-2 border-red-600 text-red-500 font-bold text-sm rounded-xl hover:bg-red-950/40 transition shadow-xs"
                    >
                      + Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-red-950/60 px-3 py-2 rounded-xl border border-red-900/60">
                      <button onClick={() => updateQuantity(item, -1)} className="text-red-400 font-black px-1.5 text-base">−</button>
                      <span className="font-bold text-white text-sm w-4 text-center">{currentQty}</span>
                      <button onClick={() => updateQuantity(item, 1)} className="text-red-400 font-black px-1.5 text-base">+</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* Floating Bottom Cart Bar */}
      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-40">
        <div className="w-full max-w-md bg-gray-900/95 backdrop-blur-md h-16 px-6 rounded-full shadow-2xl flex items-center justify-between border border-gray-800">
          <div className="relative flex items-center justify-center w-10 h-10 bg-red-950 rounded-full text-red-500 font-bold border border-red-900">
            🛒
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {totalItemCount}
            </span>
          </div>
          <span className="font-black text-white text-base">{finalTotalPrice.toFixed(2)} Br</span>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-black px-7 py-2.5 rounded-full transition text-sm shadow-lg"
          >
            Buy now
          </button>
        </div>
      </div>

      {/* Checkout Menu Drawer / Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center backdrop-blur-xs">
          <div className="bg-gray-900 w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] flex flex-col shadow-2xl border-t border-red-600/30">
            <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-white">Active Checkout Summary</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-white font-bold text-lg w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">✕</button>
            </div>

            {/* Delivery details inputs */}
            <div className="space-y-3 mb-4 bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  <option value="Telebirr">Telebirr</option>
                  <option value="CBE Birr">CBE Birr</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 my-1 pr-1">
              {Object.keys(userCart).length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">Your cart is currently empty</p>
              ) : (
                Object.values(userCart).map((entry) => {
                  const cartKey = `${entry.item.restaurant}-${entry.item.branch}-${entry.item.name}`;
                  return (
                    <div key={cartKey} className="flex justify-between items-center bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
                      <div className="flex-1 pr-2">
                        <h4 className="font-bold text-sm text-white">{entry.item.name}</h4>
                        <p className="text-[10px] text-red-500 font-semibold">{entry.item.restaurant} ({entry.item.branch})</p>
                        <p className="text-xs text-gray-400">{entry.item.price.toFixed(2)} Br each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(entry.item, -1)} className="w-7 h-7 bg-gray-900 border border-gray-800 rounded-lg text-red-500 font-bold flex items-center justify-center">−</button>
                        <span className="text-sm font-bold w-4 text-center">{entry.quantity}</span>
                        <button onClick={() => updateQuantity(entry.item, 1)} className="w-7 h-7 bg-gray-900 border border-gray-800 rounded-lg text-red-500 font-bold flex items-center justify-center">+</button>
                      </div>
                      <span className="font-black text-sm text-white ml-4 w-20 text-right">
                        {(entry.item.price * entry.quantity).toFixed(2)} Br
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-gray-800 pt-4 space-y-2 mt-3">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Subtotal</span>
                <span>{subtotalPrice.toFixed(2)} Br</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Kitchen Prep Tax (10%)</span>
                <span>{kitchenPrepTax.toFixed(2)} Br</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Delivery Fee</span>
                <span>{totalItemCount > 0 ? `${deliveryFee.toFixed(2)} Br` : '0.00 Br'}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-gray-800">
                <span>Total Amount</span>
                <span className="text-red-500">{finalTotalPrice.toFixed(2)} Br</span>
              </div>
            </div>

            <button
              disabled={Object.keys(userCart).length === 0}
              onClick={handleConfirmOrder}
              className="w-full mt-5 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black rounded-2xl transition shadow-lg text-sm"
            >
              Submit Order Now 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}