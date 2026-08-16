'use client';
import React, { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  desc: string;
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
  const [authView, setAuthView] = useState<'signin' | 'signup' | 'forgot' | null>('signin');
  
  // Inputs
  const [identifierInput, setIdentifierInput] = useState(''); // Email or Phone for sign in
  const [fullNameInput, setFullNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<'feed' | 'cart'>('feed');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemModal, setItemModal] = useState<MenuItem | null>(null);

  const stores: Store[] = [
    {
      id: 's1',
      name: 'Tomoca Coffee HQ',
      category: 'Cafe',
      rating: 4.9,
      deliveryTime: '15 min',
      banner: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=60',
      menu: [
        { id: 'm1', name: 'Double Tomoca Macchiato', price: 65, desc: 'Bold dark-roasted espresso with velvety foam.' },
        { id: 'm2', name: 'Butter Croissant', price: 80, desc: 'Freshly baked flaky pastry.' }
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
        { id: 'm3', name: 'Special Doro Wat', price: 480, desc: 'Spicy chicken stew with hard-boiled eggs.' },
        { id: 'm4', name: 'Kitfo Special', price: 520, desc: 'Minced lean beef in spiced butter.' }
      ]
    }
  ];

  const addToCart = (item: MenuItem, store: Store) => {
    if (selectedStore && selectedStore.id !== store.id) {
      if (!window.confirm("Switch store? This will reset your current cart.")) return;
      setCart([]);
    }
    setSelectedStore(store);
    setCart(prevCart => {
      const existing = prevCart.find(c => c.id === item.id);
      if (existing) {
        return prevCart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    setItemModal(null);
  };

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  // Helper to resolve display name based on user rules
  const getDisplayName = (raw: string | null) => {
    if (!raw) return 'Guest';
    if (raw === 'Guest' || raw === 'Google User') return raw;
    if (raw.includes('@')) {
      const localPart = raw.split('@')[0];
      return localPart;
    }
    return raw;
  };

  const handleSignIn = () => {
    setCurrentUser(identifierInput || 'User');
    setAuthView(null);
  };

  const handleSignUp = () => {
    setCurrentUser(fullNameInput || phoneInput || emailInput || 'User');
    setAuthView(null);
  };

  if (authView) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-black tracking-tight text-white">
              DINE <span className="text-red-500">&</span> DASH
            </h1>
            <p className="text-xs text-neutral-400">
              {authView === 'signin' && 'Sign in to your account'}
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
                onClick={() => { alert('Password reset instructions sent!'); setAuthView('signin'); }}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs transition"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setAuthView('signin')}
                className="w-full text-xs text-neutral-400 hover:text-white font-bold"
              >
                Back to Sign In
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs font-bold focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m14.41 14.41l-3.59-3.59" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                onClick={handleSignUp}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs transition"
              >
                Create Account
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-neutral-400">
                  Already have an account?{' '}
                  <button onClick={() => setAuthView('signin')} className="text-red-500 font-black hover:underline">
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setAuthView('forgot')} className="text-xs text-neutral-400 hover:text-red-500 font-bold">
                  Forgot Password?
                </button>
              </div>
              <input
                type="text"
                placeholder="Email or Phone Number"
                value={identifierInput}
                onChange={e => setIdentifierInput(e.target.value)}
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs font-bold focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m14.41 14.41l-3.59-3.59" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                onClick={handleSignIn}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs transition"
              >
                Sign In
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-neutral-500 font-bold uppercase">Or</span>
                <div className="flex-grow border-t border-neutral-800"></div>
              </div>

              <button
                onClick={() => { setCurrentUser('Google User'); setAuthView(null); }}
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
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
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
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div onClick={() => { setActiveTab('feed'); setSelectedStore(null); }} className="cursor-pointer flex items-center space-x-2">
          <h1 className="font-black text-sm tracking-tight text-white">
            DINE <span className="text-red-500">&</span> DASH
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => setActiveTab('feed')} className={`px-3 py-1.5 rounded-xl text-xs font-black ${activeTab === 'feed' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}>Feed</button>
          <button onClick={() => setActiveTab('cart')} className={`px-3 py-1.5 rounded-xl text-xs font-black ${activeTab === 'cart' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}>Cart ({totalItems})</button>
          <button onClick={() => { setCurrentUser(null); setAuthView('signin'); }} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700">Sign Out</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        {activeTab === 'feed' && !selectedStore && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-white">Welcome, {getDisplayName(currentUser)}!</h2>
                <p className="text-xs text-neutral-400 mt-1">Choose a restaurant below to view their menu.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stores.map(s => (
                <div key={s.id} onClick={() => setSelectedStore(s)} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden cursor-pointer hover:border-red-500 transition">
                  <div className="h-36 relative">
                    <img src={s.banner} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-sm text-white">{s.name}</h3>
                      <span className="text-[10px] text-neutral-400">⏱️ {s.deliveryTime} • {s.category}</span>
                    </div>
                    <span className="text-red-500 font-bold text-xs">View Menu →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feed' && selectedStore && (
          <div className="space-y-4">
            <button onClick={() => setSelectedStore(null)} className="text-xs text-neutral-400 font-bold bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800 hover:text-white">← Back to Restaurants</button>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-white">{selectedStore.name}</h2>
                <p className="text-xs text-neutral-400">{selectedStore.category} • ⏱️ {selectedStore.deliveryTime}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedStore.menu.map(item => (
                <div key={item.id} onClick={() => setItemModal(item)} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 cursor-pointer flex justify-between items-center hover:border-red-500 transition">
                  <div>
                    <h4 className="font-black text-xs text-white">{item.name}</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{item.desc}</p>
                    <p className="text-xs font-black text-red-500 mt-2">{item.price} ETB</p>
                  </div>
                  <span className="w-7 h-7 bg-red-600/20 text-red-500 rounded-xl flex items-center justify-center font-black">+</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-black text-white">Your Cart</h2>
            {cart.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-xs text-neutral-400">Your cart is empty.</div>
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                {cart.map(i => (
                  <div key={i.id} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{i.name} (x{i.quantity})</span>
                    <span className="font-black text-red-500">{i.price * i.quantity} ETB</span>
                  </div>
                ))}
                <div className="border-t border-neutral-800 pt-3 flex justify-between font-black text-sm text-white">
                  <span>Total</span><span className="text-red-500">{subtotal} ETB</span>
                </div>
                <button onClick={() => { alert('Order placed successfully!'); setCart([]); setActiveTab('feed'); }} className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-xs hover:bg-red-500 transition">Checkout</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ITEM MODAL */}
      {itemModal && selectedStore && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-black text-base text-white">{itemModal.name}</h3>
            <p className="text-xs text-neutral-400">{itemModal.desc}</p>
            <p className="font-black text-sm text-red-500">{itemModal.price} ETB</p>
            <div className="flex space-x-2 pt-2">
              <button onClick={() => setItemModal(null)} className="flex-1 py-2.5 bg-neutral-800 rounded-xl text-xs font-bold text-neutral-300 hover:bg-neutral-700">Cancel</button>
              <button onClick={() => addToCart(itemModal, selectedStore)} className="flex-1 py-2.5 bg-red-600 rounded-xl text-xs font-bold text-white hover:bg-red-500">Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}