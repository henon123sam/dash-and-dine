'use client';

import React, { useState } from 'react';

// --- Types ---
interface FoodItem {
  name: string;
  price: number;
  category: string;
  restaurant: string;
}

interface CartItemEntry {
  item: FoodItem;
  quantity: number;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  deliveryTime: string;
  rating: number;
  menu: FoodItem[];
}

// --- Restaurants and Menus matching the reference layout ---
const restaurantsData: Restaurant[] = [
  {
    id: 'slice-house',
    name: 'Slice House Pizza',
    image: '🍕',
    cuisine: 'Pizza',
    deliveryTime: '20-30 min',
    rating: 4.8,
    menu: [
      { name: 'Margherita Classic', price: 950.0, category: 'Pizza', restaurant: 'Slice House Pizza' },
      { name: 'Pepperoni Feast', price: 1200.0, category: 'Pizza', restaurant: 'Slice House Pizza' },
      { name: 'BBQ Chicken Pizza', price: 1350.0, category: 'Pizza', restaurant: 'Slice House Pizza' },
      { name: 'Garlic Parmesan Crust', price: 450.0, category: 'Sides', restaurant: 'Slice House Pizza' },
      { name: 'Coca Cola Soft Drink', price: 75.0, category: 'Drinks', restaurant: 'Slice House Pizza' },
    ],
  },
  {
    id: 'burger-craft',
    name: 'Burger Craft',
    image: '🍔',
    cuisine: 'Burgers',
    deliveryTime: '15-25 min',
    rating: 4.6,
    menu: [
      { name: 'Simple Special Burger', price: 1627.25, category: 'Burgers', restaurant: 'Burger Craft' },
      { name: 'Malmö Smash Burger', price: 730.0, category: 'Burgers', restaurant: 'Burger Craft' },
      { name: 'BBQ Triple Cheese Burger', price: 799.0, category: 'Burgers', restaurant: 'Burger Craft' },
      { name: 'Crispy Fries', price: 350.0, category: 'Sides', restaurant: 'Burger Craft' },
      { name: 'Coca Cola Soft Drink', price: 75.0, category: 'Drinks', restaurant: 'Burger Craft' },
    ],
  },
  {
    id: 'sakura-sushi',
    name: 'Sakura Sushi',
    image: '🍱',
    cuisine: 'Sushi',
    deliveryTime: '30-40 min',
    rating: 4.9,
    menu: [
      { name: 'Salmon Roll Deluxe', price: 1450.0, category: 'Sushi', restaurant: 'Sakura Sushi' },
      { name: 'Spicy Tuna Roll', price: 1300.0, category: 'Sushi', restaurant: 'Sakura Sushi' },
      { name: 'Dragon Roll', price: 1650.0, category: 'Sushi', restaurant: 'Sakura Sushi' },
      { name: 'Miso Soup', price: 300.0, category: 'Sides', restaurant: 'Sakura Sushi' },
      { name: 'Green Tea', price: 120.0, category: 'Drinks', restaurant: 'Sakura Sushi' },
    ],
  },
];

export default function DineAndDashApp() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  if (!loggedInUser) {
    return <AuthScreen onLoggedIn={(userHandle) => setLoggedInUser(userHandle)} />;
  }

  return <MainDashboardScreen userEmail={loggedInUser} onSignOut={() => setLoggedInUser(null)} />;
}

// --- Authentication Screen (Email, Full Name, Phone, Country selector, and Google Account Picker) ---
function AuthScreen({ onLoggedIn }: { onLoggedIn: (identifier: string) => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'input' | 'password' | 'otp' | 'forgot' | 'signup_details' | 'google_picker'>('input');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [country, setCountry] = useState('Ethiopia (+251)');
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
    if (!fullName || !password || !signupPhone) {
      alert('Please fill out all fields to create your account.');
      return;
    }
    alert(`Account successfully created for ${fullName} (${country})!`);
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-neutral-900 rounded-3xl shadow-2xl p-8 border border-red-600/40">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-red-600 tracking-wider mb-1">DINE & DASH</h1>
          <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">Speed & Flavor Delivered</p>
        </div>

        {step !== 'google_picker' && (
          <div className="flex bg-black p-1 rounded-full mb-6 border border-neutral-800">
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-full transition ${!isSignUp ? 'bg-red-600 text-white shadow-lg' : 'text-neutral-400'}`}
              onClick={() => { setIsSignUp(false); setStep('input'); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-full transition ${isSignUp ? 'bg-red-600 text-white shadow-lg' : 'text-neutral-400'}`}
              onClick={() => { setIsSignUp(true); setStep('input'); }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* GOOGLE ACCOUNT CHOOSER */}
        {step === 'google_picker' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center pb-2 border-b border-neutral-800">
              <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.33 7.22 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.82 0 12s.43 3.88 1.18 5.4l4.09-3.16z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.67 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <h2 className="text-base font-bold text-white">Choose an account</h2>
              <p className="text-xs text-neutral-400">to continue to Dine & Dash</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onLoggedIn('frequent.user@gmail.com')}
                className="w-full flex items-center gap-3 p-3 bg-black hover:bg-neutral-800 rounded-2xl border border-neutral-800 transition text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  F
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-white group-hover:text-red-500 transition">Frequent User</p>
                  <p className="text-xs text-neutral-400 truncate">frequent.user@gmail.com</p>
                </div>
              </button>

              <button
                onClick={() => onLoggedIn('secondary.account@gmail.com')}
                className="w-full flex items-center gap-3 p-3 bg-black hover:bg-neutral-800 rounded-2xl border border-neutral-800 transition text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  S
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-white group-hover:text-red-500 transition">Secondary Account</p>
                  <p className="text-xs text-neutral-400 truncate">secondary.account@gmail.com</p>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="w-full py-2.5 text-xs text-neutral-400 hover:text-white font-bold transition"
            >
              Cancel
            </button>
          </div>
        )}

        {/* STEP 1 */}
        {step === 'input' && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                {isSignUp ? 'Email Address' : 'Email or Phone Number'}
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
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

        {/* SIGN UP DETAILS VIEW: Email, Full Name, Password, Phone, Country */}
        {step === 'signup_details' && (
          <form onSubmit={handleCompleteSignUp} className="space-y-3">
            <div className="bg-red-950/40 p-3 rounded-xl border border-red-900/50 flex items-center justify-between mb-1">
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
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
                placeholder="911223344"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
              >
                <option value="Ethiopia (+251)">Ethiopia (+251)</option>
                <option value="United States (+1)">United States (+1)</option>
                <option value="United Kingdom (+44)">United Kingdom (+44)</option>
                <option value="Kenya (+254)">Kenya (+254)</option>
                <option value="UAE (+971)">UAE (+971)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-lg text-sm mt-2"
            >
              Complete Account Creation
            </button>
          </form>
        )}

        {/* STEP 2A: PASSWORD */}
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
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
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

        {/* STEP 2B: OTP */}
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

        {/* FORGOT PASSWORD */}
        {step === 'forgot' && (
          <form onSubmit={handleSendResetLink} className="space-y-4">
            <p className="text-xs text-neutral-400 mb-2">
              Enter your email address and we&apos;ll send you recovery instructions.
            </p>
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-white text-sm"
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
              className="w-full py-2 text-xs text-neutral-500 font-bold hover:text-neutral-300"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {step === 'input' && (
          <>
            <div className="mt-6 text-center text-xs text-neutral-500 uppercase tracking-widest font-semibold">Or continue instantly</div>
            
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setStep('google_picker')}
                className="flex-1 py-3 px-3 bg-black border border-neutral-800 rounded-xl font-bold text-neutral-200 hover:bg-neutral-800 transition flex items-center justify-center gap-2 text-xs"
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
                className="flex-1 py-3 px-3 bg-black border border-neutral-800 rounded-xl font-bold text-neutral-200 hover:bg-neutral-800 transition flex items-center justify-center gap-2 text-xs"
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

// --- Main Dashboard Screen (Matching Photo Layout Exactly: Red Header, Search bar, Cuisines pills, Featured Spots) ---
function MainDashboardScreen({ userEmail, onSignOut }: { userEmail: string; onSignOut: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [userCart, setUserCart] = useState<Record<string, CartItemEntry>>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Bole Road, Addis Ababa');
  const [paymentMethod, setPaymentMethod] = useState('Telebirr');
  const [showAccountModal, setShowAccountModal] = useState(false);

  const isGuest = userEmail === 'Guest User';

  const cuisines = ['🍕 Pizza', '🍔 Burgers', '🍱 Sushi', '🌮 Tacos', '🍜 Asian', '🍰 Desserts', '🥗 Healthy'];

  const filteredRestaurants = restaurantsData.filter(
    (r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateQuantity = (item: FoodItem, delta: number) => {
    setUserCart((prev) => {
      const updated = { ...prev };
      const cartKey = `${item.restaurant}-${item.name}`;
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
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Top Navbar Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30">
        <h1 className="text-xl font-black text-red-600 tracking-wider cursor-pointer" onClick={() => setSelectedRestaurant(null)}>
          DINE & DASH 🚀
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { if (isGuest) setShowAccountModal(true); }}
            className={`text-left px-3 py-1.5 rounded-xl border transition ${
              isGuest ? 'bg-red-950/40 border-red-600/40 hover:bg-red-900/40 cursor-pointer' : 'bg-black border-neutral-800 cursor-default'
            }`}
          >
            <p className="text-[10px] text-neutral-400">Account</p>
            <p className="text-xs font-bold text-white flex items-center gap-1">
              {userEmail} {isGuest && <span className="text-[10px] text-red-500 font-extrabold underline">⚠️ No Acc</span>}
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
          <div className="bg-neutral-900 max-w-sm w-full rounded-3xl p-6 shadow-2xl text-center border border-red-600/40">
            <div className="w-12 h-12 bg-red-950 rounded-full flex items-center justify-center mx-auto mb-3 text-xl text-red-500 border border-red-900">
              👤
            </div>
            <h3 className="text-lg font-black text-white mb-1">You don&apos;t have an account yet!</h3>
            <p className="text-xs text-neutral-400 mb-6">
              You are browsing in Guest Mode. Sign in or create a full account to save addresses and track your orders seamlessly.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAccountModal(false)}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl transition"
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

      {/* VIEW 1: EXACT PHOTO LAYOUT (Red Hero Banner + Search + Explore Cuisines + Featured Spots) */}
      {!selectedRestaurant ? (
        <div>
          {/* Red Hero Banner Section */}
          <div className="bg-red-600 pt-16 pb-20 px-6 text-center shadow-xl">
            <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white mb-6">
              <span>📍 Deliver to: [Home] Set your delivery location</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              Hungry? <span className="text-black">Dash and Dine</span> delivers.
            </h2>
            <p className="text-neutral-100 text-sm font-medium mb-8">
              Order food from your favorite local restaurants in seconds.
            </p>

            {/* Search Bar matching the photo */}
            <div className="max-w-2xl mx-auto relative flex items-center bg-white rounded-2xl p-2 shadow-2xl">
              <span className="pl-3 text-neutral-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search for restaurants or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none bg-transparent"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-xl transition text-sm shadow-md">
                Find Food
              </button>
            </div>
          </div>

          {/* Explore Cuisines Bar */}
          <div className="max-w-5xl mx-auto px-6 mt-8">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Explore Cuisines</h3>
            <div className="overflow-x-auto flex gap-3 pb-2">
              {cuisines.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(c.split(' ')[1])}
                  className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-red-600 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-sm text-neutral-200"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Spots Grid matching the photo */}
          <div className="max-w-5xl mx-auto px-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Featured Spots</h3>
              <span className="text-xs font-bold text-red-500 cursor-pointer hover:underline">See all</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRestaurants.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRestaurant(r)}
                  className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden hover:border-red-600 transition cursor-pointer shadow-lg group"
                >
                  <div className="h-44 bg-neutral-950 flex items-center justify-center text-6xl relative group-hover:scale-105 transition duration-300">
                    {r.image}
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-neutral-200 border border-neutral-700">
                      ⏱ {r.deliveryTime}
                    </span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-white text-base group-hover:text-red-500 transition">{r.name}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">{r.cuisine}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-red-950/60 text-red-400 text-xs font-bold rounded-lg border border-red-900/50">
                      ★ {r.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: INDIVIDUAL RESTAURANT MENU */
        <main className="max-w-4xl mx-auto px-6 py-6 space-y-6">
          <button
            onClick={() => setSelectedRestaurant(null)}
            className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1 mb-2"
          >
            ← Back to Restaurants
          </button>

          <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 flex items-center gap-6">
            <div className="w-20 h-20 bg-neutral-950 rounded-2xl flex items-center justify-center text-4xl border border-neutral-800">
              {selectedRestaurant.image}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{selectedRestaurant.name}</h2>
              <p className="text-xs text-red-400 font-bold mt-1">{selectedRestaurant.cuisine} • ⏱ {selectedRestaurant.deliveryTime} • ★ {selectedRestaurant.rating}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Menu Items</h3>
            <div className="space-y-3">
              {selectedRestaurant.menu.map((item) => {
                const cartKey = `${item.restaurant}-${item.name}`;
                const currentQty = userCart[cartKey]?.quantity || 0;
                return (
                  <div key={cartKey} className="flex items-center justify-between bg-neutral-900 p-4 rounded-3xl shadow-sm border border-neutral-800 hover:border-neutral-700 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-neutral-950 rounded-2xl flex items-center justify-center text-red-500 font-bold text-xl border border-neutral-800">
                        {selectedRestaurant.image}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{item.name}</h4>
                        <span className="inline-block px-2 py-0.5 bg-black text-neutral-400 text-[10px] font-semibold rounded-md mt-0.5 border border-neutral-800">
                          {item.category}
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
          </div>
        </main>
      )}

      {/* Floating Bottom Cart Bar */}
      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-40">
        <div className="w-full max-w-md bg-neutral-900/95 backdrop-blur-md h-16 px-6 rounded-full shadow-2xl flex items-center justify-between border border-neutral-800">
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

      {/* Checkout Drawer */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center backdrop-blur-xs">
          <div className="bg-neutral-900 w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] flex flex-col shadow-2xl border-t border-red-600/40">
            <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-white">Active Checkout Summary</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-neutral-400 hover:text-white font-bold text-lg w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">✕</button>
            </div>

            <div className="space-y-3 mb-4 bg-black p-3.5 rounded-2xl border border-neutral-800">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
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
                <p className="text-center text-neutral-500 py-8 text-sm">Your cart is currently empty</p>
              ) : (
                Object.values(userCart).map((entry) => {
                  const cartKey = `${entry.item.restaurant}-${entry.item.name}`;
                  return (
                    <div key={cartKey} className="flex justify-between items-center bg-black p-3.5 rounded-2xl border border-neutral-800">
                      <div className="flex-1 pr-2">
                        <h4 className="font-bold text-sm text-white">{entry.item.name}</h4>
                        <p className="text-[10px] text-red-500 font-semibold">{entry.item.restaurant}</p>
                        <p className="text-xs text-neutral-400">{entry.item.price.toFixed(2)} Br each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(entry.item, -1)} className="w-7 h-7 bg-neutral-900 border border-neutral-800 rounded-lg text-red-500 font-bold flex items-center justify-center">−</button>
                        <span className="text-sm font-bold w-4 text-center">{entry.quantity}</span>
                        <button onClick={() => updateQuantity(entry.item, 1)} className="w-7 h-7 bg-neutral-900 border border-neutral-800 rounded-lg text-red-500 font-bold flex items-center justify-center">+</button>
                      </div>
                      <span className="font-black text-sm text-white ml-4 w-20 text-right">
                        {(entry.item.price * entry.quantity).toFixed(2)} Br
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-neutral-800 pt-4 space-y-2 mt-3">
              <div className="flex justify-between text-xs font-medium text-neutral-400">
                <span>Subtotal</span>
                <span>{subtotalPrice.toFixed(2)} Br</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-neutral-400">
                <span>Kitchen Prep Tax (10%)</span>
                <span>{kitchenPrepTax.toFixed(2)} Br</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-neutral-400">
                <span>Delivery Fee</span>
                <span>{totalItemCount > 0 ? `${deliveryFee.toFixed(2)} Br` : '0.00 Br'}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-neutral-800">
                <span>Total Amount</span>
                <span className="text-red-500">{finalTotalPrice.toFixed(2)} Br</span>
              </div>
            </div>

            <button
              disabled={Object.keys(userCart).length === 0}
              onClick={handleConfirmOrder}
              className="w-full mt-5 py-4 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-black rounded-2xl transition shadow-lg text-sm"
            >
              Submit Order Now 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}