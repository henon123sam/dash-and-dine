'use client';
import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  desc: string;
  image: string;
  category: 'Burger' | 'Chicken';
}

interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  banner: string;
  menu: MenuItem[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function DineAndDashApp() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot' | null>('login');
  
  // Inputs
  const [identifierInput, setIdentifierInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<'feed' | 'cart'>('feed');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemModal, setItemModal] = useState<MenuItem | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Burger' | 'Chicken'>('All');

  const stores: Store[] = [
    {
      id: 's1',
      name: 'Tomoca Coffee HQ',
      category: 'Cafe',
      rating: 4.9,
      deliveryTime: '15 min',
      banner: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=60',
      menu: [
        { id: 'm1', name: 'Double Tomoca Macchiato', price: 65, desc: 'Bold dark-roasted espresso with velvety foam.', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=60', category: 'Burger' },
        { id: 'm2', name: 'Butter Croissant', price: 80, desc: 'Freshly baked flaky pastry.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=60', category: 'Burger' }
      ]
    },
    {
      id: 's2',
      name: 'Habesha Feast',
      category: 'Traditional',
      rating: 4.8,
      deliveryTime: '30 min',
      banner: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60',
      menu: [
        { id: 'm3', name: 'Special Doro Wat', price: 480, desc: 'Spicy chicken stew with hard-boiled eggs.', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=60', category: 'Chicken' },
        { id: 'm4', name: 'Kitfo Special', price: 520, desc: 'Minced lean beef in spiced butter.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60', category: 'Burger' }
      ]
    },
    {
      id: 's3',
      name: 'Simple Bistro | Summit',
      category: 'Burger & Chicken',
      rating: 4.9,
      deliveryTime: '20 min',
      banner: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=60',
      menu: [
        { id: 'sb1', name: 'Single Chicken Junkie', price: 1414.5, desc: 'Crispy chicken fillet with signature sauce.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=60', category: 'Chicken' },
        { id: 'sb2', name: 'Simple Special Burger', price: 1627.25, desc: 'Double patty burger with special house blend.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60', category: 'Burger' },
        { id: 'sb3', name: 'Chicken Junkie', price: 1874.5, desc: 'Large portion of loaded chicken junkie burger.', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&auto=format&fit=crop&q=60', category: 'Chicken' },
        { id: 'sb4', name: 'Chicken Burger', price: 1242.0, desc: 'Classic chicken burger with fresh lettuce and mayo.', image: 'https://images.unsplash.com/photo-1615297258129-234e2e283253?w=800&auto=format&fit=crop&q=60', category: 'Chicken' },
        { id: 'sb5', name: 'Double Saucy', price: 1627.25, desc: 'Extra loaded double patty with rich sauce.', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=60', category: 'Burger' },
        { id: 'sb6', name: 'Beef Junkie Burger', price: 1627.25, desc: 'Juicy beef patty packed with flavor.', image: 'https://images.unsplash.com/photo-1553979459-d2229cdc743b?w=800&auto=format&fit=crop&q=60', category: 'Burger' },
        { id: 'sb7', name: 'Texas Style', price: 1627.25, desc: 'Smoky BBQ burger with onion rings and melted cheese.', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=60', category: 'Burger' },
        { id: 'sb8', name: 'Double Swiss', price: 1627.25, desc: 'Rich double beef burger topped with Swiss cheese.', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&auto=format&fit=crop&q=60', category: 'Burger' },
        { id: 'sb9', name: 'Cheese Burger', price: 1161.5, desc: 'Classic cheeseburger with melted cheddar.', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop&q=60', category: 'Burger' },
        { id: 'sb10', name: 'Swiss Style', price: 1184.5, desc: 'Savory burger topped with melted Swiss cheese.', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=60', category: 'Burger' }
      ]
    }
  ];

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user.displayName || result.user.email);
      setAuthView(null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, identifierInput, passInput);
      setCurrentUser(result.user.email);
      setAuthView(null);
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, emailInput, passInput);
      alert('Account created successfully! Please log in.');
      setAuthView('login');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered! Please log in instead.');
      } else {
        alert(error.message);
      }
    }
  };

  const getDisplayName = (raw: string | null) => {
    if (!raw) return 'Guest';
    if (raw.includes('@')) return raw.split('@')[0];
    return raw;
  };

  if (authView) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl shadow-red-950/20">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              DINE <span className="text-red-500">&</span> DASH
            </h1>
            <p className="text-xs text-neutral-400">
              {authView === 'login' && 'Log in to your account'}
              {authView === 'signup' && 'Create a new account'}
              {authView === 'forgot' && 'Reset your password'}
            </p>
          </div>

          {authView === 'forgot' ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your email or phone number"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <button
                onClick={() => { alert('Password reset instructions sent!'); setAuthView('login'); }}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs transition shadow-lg shadow-red-600/30"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setAuthView('login')}
                className="w-full text-xs text-neutral-400 hover:text-white font-bold"
              >
                Back to Log In
              </button>
            </div>
          ) : authView === 'signup' ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={fullNameInput}
                onChange={e => setFullNameInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <input
                type="tel"
                placeholder="Phone Number (e.g. +251...)"
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <input
                type="email"
                placeholder="Email address"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={passInput}
                  onChange={e => setPassInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 pr-10 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>

              <button
                onClick={handleSignUp}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs transition shadow-lg shadow-red-600/30"
              >
                Create Account
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-neutral-500 font-bold uppercase">Or</span>
                <div className="flex-grow border-t border-neutral-800"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.8 7.4l3.7 2.9C6.4 7.3 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.5 14.7c-.2-.8-.4-1.7-.4-2.7s.2-1.9.4-2.7L1.8 6.4C.7 8.6 0 11.2 0 14s.7 5.4 1.8 7.6l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.6-2.3-6.5-5.3L1.8 15.9C3.7 19.7 7.5 23 12 23z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => { setCurrentUser('Guest'); setAuthView(null); }}
                className="w-full py-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <span>Continue as Guest</span>
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-neutral-400">
                  Already have an account?{' '}
                  <button onClick={() => setAuthView('login')} className="text-red-500 font-black hover:underline">
                    Log In
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Email or Phone Number"
                value={identifierInput}
                onChange={e => setIdentifierInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
              
              <div className="space-y-1">
                <div className="flex justify-end">
                  <button onClick={() => setAuthView('forgot')} className="text-[11px] text-neutral-400 hover:text-red-500 font-bold">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={passInput}
                    onChange={e => setPassInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 pr-10 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleEmailLogin}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs transition shadow-lg shadow-red-600/30"
              >
                Log In
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-neutral-500 font-bold uppercase">Or</span>
                <div className="flex-grow border-t border-neutral-800"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.8 7.4l3.7 2.9C6.4 7.3 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.5 14.7c-.2-.8-.4-1.7-.4-2.7s.2-1.9.4-2.7L1.8 6.4C.7 8.6 0 11.2 0 14s.7 5.4 1.8 7.6l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.6-2.3-6.5-5.3L1.8 15.9C3.7 19.7 7.5 23 12 23z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => { setCurrentUser('Guest'); setAuthView(null); }}
                className="w-full py-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <span>Continue as Guest</span>
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-neutral-400">
                  Don't have an account?{' '}
                  <button onClick={() => setAuthView('signup')} className="text-red-500 font-black hover:underline">
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col">
      {/* HEADER */}
      <header className="bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div onClick={() => { setActiveTab('feed'); setSelectedStore(null); }} className="cursor-pointer flex items-center space-x-2">
          <h1 className="font-black text-sm tracking-tight text-white">
            DINE <span className="text-red-500">&</span> DASH
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => setActiveTab('feed')} className={`px-4 py-2 rounded-xl text-xs font-black transition ${activeTab === 'feed' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}>Feed</button>
          <button onClick={() => setActiveTab('cart')} className={`px-4 py-2 rounded-xl text-xs font-black transition ${activeTab === 'cart' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</button>
          <button onClick={() => { setCurrentUser(null); setAuthView('login'); }} className="px-3 py-2 rounded-xl text-xs font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition">Log Out</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        {activeTab === 'feed' && !selectedStore && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-900 border border-neutral-800 rounded-3xl p-6 flex justify-between items-center shadow-xl">
              <div>
                <h2 className="text-2xl font-black text-white">Welcome, {getDisplayName(currentUser)}! 🔥</h2>
                <p className="text-xs text-neutral-400 mt-1">Pick a restaurant and satisfy your cravings right away.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {stores.map(s => (
                <div key={s.id} onClick={() => setSelectedStore(s)} className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden cursor-pointer hover:border-red-500 transition group shadow-lg">
                  <div className="h-44 relative overflow-hidden">
                    <img src={s.banner} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent"></div>
                    <span className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-red-400 border border-neutral-800">⏱️ {s.deliveryTime}</span>
                  </div>
                  <div className="p-5 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-base text-white">{s.name}</h3>
                      <span className="text-xs text-neutral-400">{s.category}</span>
                    </div>
                    <span className="bg-red-600/10 text-red-500 font-black text-xs px-3 py-2 rounded-xl group-hover:bg-red-600 group-hover:text-white transition">Explore →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feed' && selectedStore && (
          <div className="space-y-6">
            <button onClick={() => setSelectedStore(null)} className="text-xs text-neutral-400 font-bold bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-800 hover:text-white transition">← Back to Restaurants</button>
            
            <div className="relative h-48 rounded-3xl overflow-hidden border border-neutral-800 shadow-xl">
              <img src={selectedStore.banner} alt={selectedStore.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
              <div className="absolute bottom-5 left-5 space-y-1">
                <h2 className="text-2xl font-black text-white">{selectedStore.name}</h2>
                <p className="text-xs text-neutral-300 font-medium">{selectedStore.category} • ⏱️ {selectedStore.deliveryTime}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              {(['All', 'Burger', 'Chicken'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition ${selectedCategory === cat ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedStore.menu
                .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
                .map(item => (
                <div key={item.id} onClick={() => { setItemModal(item); setModalQty(1); }} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 cursor-pointer flex items-center justify-between hover:border-red-500 transition group shadow-md">
                  <div className="flex items-center space-x-4 pr-3">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover border border-neutral-800 group-hover:scale-105 transition" />
                    <div className="space-y-1">
                      <h4 className="font-black text-xs text-white group-hover:text-red-400 transition">{item.name}</h4>
                      <p className="text-[10px] text-neutral-400 line-clamp-2">{item.desc}</p>
                      <p className="text-xs font-black text-red-500">{item.price} Br</p>
                    </div>
                  </div>
                  <button className="w-9 h-9 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center font-black group-hover:bg-red-600 group-hover:text-white transition shadow">
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-black text-white">Your Cart 🛒</h2>
            {cart.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-10 text-center text-xs text-neutral-400 shadow-xl">Your cart is empty.</div>
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-5 shadow-xl">
                {cart.map(i => (
                  <div key={i.id} className="flex justify-between items-center text-xs border-b border-neutral-800/60 pb-3">
                    <div className="flex items-center space-x-3">
                      <img src={i.image} alt={i.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold text-white block">{i.name}</span>
                        <span className="text-[10px] text-neutral-400">Qty: {i.quantity}</span>
                      </div>
                    </div>
                    <span className="font-black text-red-500">{i.price * i.quantity} Br</span>
                  </div>
                ))}
                <div className="pt-2 flex justify-between font-black text-base text-white">
                  <span>Total</span><span className="text-red-500">{cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)} Br</span>
                </div>
                <button onClick={() => { alert('Order placed successfully!'); setCart([]); setActiveTab('feed'); }} className="w-full py-3.5 bg-red-600 text-white rounded-2xl font-black text-xs hover:bg-red-500 transition shadow-lg shadow-red-600/30">Checkout Now</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ITEM MODAL */}
      {itemModal && selectedStore && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="h-44 rounded-2xl overflow-hidden relative border border-neutral-800">
              <img src={itemModal.image} alt={itemModal.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-black text-base text-white">{itemModal.name}</h3>
              <p className="text-xs text-neutral-400">{itemModal.desc}</p>
              <p className="font-black text-base text-red-500 pt-1">{itemModal.price} Br</p>
            </div>

            <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 rounded-2xl p-3">
              <span className="text-xs font-bold text-neutral-300">Quantity</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                  className="w-8 h-8 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-black flex items-center justify-center transition border border-neutral-800"
                >
                  -
                </button>
                <span className="text-sm font-black text-white w-4 text-center">{modalQty}</span>
                <button
                  onClick={() => setModalQty(modalQty + 1)}
                  className="w-8 h-8 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-black flex items-center justify-center transition border border-neutral-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button onClick={() => setItemModal(null)} className="flex-1 py-3 bg-neutral-800 rounded-2xl text-xs font-bold text-neutral-300 hover:bg-neutral-700 transition">Cancel</button>
              <button onClick={() => {
                setSelectedStore(selectedStore);
                setCart(prev => {
                  const existing = prev.find(c => c.id === itemModal.id);
                  if (existing) {
                    return prev.map(c => c.id === itemModal.id ? { ...c, quantity: c.quantity + modalQty } : c);
                  }
                  return [...prev, { ...itemModal, quantity: modalQty }];
                });
                setItemModal(null);
                setModalQty(1);
              }} className="flex-1 py-3 bg-red-600 rounded-2xl text-xs font-black text-white hover:bg-red-500 transition shadow-lg shadow-red-600/30">Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}