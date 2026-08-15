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

// --- Combined Menu Data (Simple Bistro | Bole & Smash Burger | Bole) ---
const globalMenu: FoodItem[] = [
  // Simple Bistro | Bole
  { name: 'Single Chicken Junkie', price: 1414.5, category: 'Chicken', restaurant: 'Simple Bistro | Bole' },
  { name: 'Simple Special Burger', price: 1627.25, category: 'Burger', restaurant: 'Simple Bistro | Bole' },
  { name: 'Chicken Junkie', price: 1874.5, category: 'Chicken', restaurant: 'Simple Bistro | Bole' },
  { name: 'Chicken Burger', price: 1242.0, category: 'Chicken', restaurant: 'Simple Bistro | Bole' },
  { name: 'Swiss Style', price: 1184.5, category: 'Burger', restaurant: 'Simple Bistro | Bole' },
  { name: 'Double Saucy', price: 1627.25, category: 'Burger', restaurant: 'Simple Bistro | Bole' },
  { name: 'Beef Junkie Burger', price: 1627.25, category: 'Burger', restaurant: 'Simple Bistro | Bole' },
  { name: 'Texas Style', price: 1627.25, category: 'Burger', restaurant: 'Simple Bistro | Bole' },
  { name: 'Double Swiss', price: 1627.25, category: 'Burger', restaurant: 'Simple Bistro | Bole' },
  { name: 'Cheese Burger (Bistro)', price: 1161.5, category: 'Burger', restaurant: 'Simple Bistro | Bole' },

  // Smash Burger | Bole
  { name: 'Malmö Smash', price: 730.0, category: 'Smash Burger', restaurant: 'Smash Burger | Bole' },
  { name: 'BBQ Triple Cheese Burger', price: 799.0, category: 'Smash Burger', restaurant: 'Smash Burger | Bole' },
  { name: 'Chili Burger', price: 630.0, category: 'Smash Burger', restaurant: 'Smash Burger | Bole' },
  { name: 'Coca Cola Soft Drink', price: 75.0, category: 'Drinks', restaurant: 'Smash Burger | Bole' },
  { name: 'Hillbilly BBQ', price: 730.0, category: 'Smash Burger', restaurant: 'Smash Burger | Bole' },
  { name: 'BBQ Double Cheese Burger', price: 710.0, category: 'Smash Burger', restaurant: 'Smash Burger | Bole' },
  { name: 'Double Cheese Burger', price: 690.0, category: 'Smash Burger', restaurant: 'Smash Burger | Bole' },
  { name: 'Triple Cheese Burger', price: 740.0, category: 'Smash Burger', restaurant: 'Smash Burger | Bole' },
  { name: 'BBQ Cheese Burger', price: 640.0, category: 'Smash Burger', restaurant: 'Smash Burger | Bole' },
  { name: 'Cheese Burger', price: 620.0, category: 'Smash Burger', restaurant: 'Smash Burger | Bole' },
];

export default function DineAndDashApp() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  if (!loggedInUser) {
    return <AuthScreen onLoggedIn={(email) => setLoggedInUser(email)} />;
  }

  return <MainDashboardScreen userEmail={loggedInUser} onSignOut={() => setLoggedInUser(null)} />;
}

// --- Authentication Component (Sign In & Sign Up Suite) ---
function AuthScreen({ onLoggedIn }: { onLoggedIn: (email: string) => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter a valid email address');
      return;
    }
    onLoggedIn(email);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-orange-600 mb-1">Dine & Dash 🚀</h1>
          <p className="text-gray-500 text-sm">Your favorite Bole restaurants delivered fast</p>
        </div>

        {/* Tab switcher for Sign In / Create Account */}
        <div className="flex bg-gray-100 p-1 rounded-full mb-6">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition ${!isSignUp ? 'bg-orange-600 text-white shadow' : 'text-gray-600'}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition ${isSignUp ? 'bg-orange-600 text-white shadow' : 'text-gray-600'}`}
            onClick={() => setIsSignUp(true)}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required={isSignUp}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  placeholder="Abebe Kebede"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required={isSignUp}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  placeholder="+251 91 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md"
          >
            {isSignUp ? 'Complete Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">Or connect with social accounts</div>
        
        {/* Social Login Buttons with Google SVG Icon */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <button
            type="button"
            onClick={() => onLoggedIn('google_user@gmail.com')}
            className="py-2.5 px-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-1.5 text-xs shadow-xs"
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
            onClick={() => onLoggedIn('telebirr_user@ethionet.et')}
            className="py-2.5 px-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-1.5 text-xs shadow-xs"
          >
            📱 Telebirr
          </button>

          <button
            type="button"
            onClick={() => onLoggedIn('apple_user@icloud.com')}
            className="py-2.5 px-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-1.5 text-xs shadow-xs"
          >
            🍎 Apple
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Dashboard Component ---
function MainDashboardScreen({ userEmail, onSignOut }: { userEmail: string; onSignOut: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userCart, setUserCart] = useState<Record<string, CartItemEntry>>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Bole Road, Addis Ababa');
  const [paymentMethod, setPaymentMethod] = useState('Telebirr');

  const categories = ['All', 'Burger', 'Chicken', 'Smash Burger', 'Drinks'];

  const displayedItems = selectedCategory === 'All'
    ? globalMenu
    : globalMenu.filter((item) => item.category === selectedCategory);

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
  const kitchenPrepTax = subtotalPrice * 0.10; // 10% Kitchen Prep Tax
  const deliveryFee = 150.0;
  const finalTotalPrice = subtotalPrice + kitchenPrepTax + (totalItemCount > 0 ? deliveryFee : 0);

  const handleConfirmOrder = () => {
    alert(`Order submitted successfully! Sent to kitchen and will be delivered to: ${deliveryAddress}`);
    setUserCart({});
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] pb-32">
      {/* Top Header */}
      <header className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto border-b border-gray-100 bg-white shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Dine & Dash 🚀</h1>
          <p className="text-xs font-medium text-orange-600">Simple Bistro & Smash Burger | Bole Road</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-xs font-semibold text-gray-700">{userEmail}</p>
          </div>
          <button
            onClick={onSignOut}
            className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Category Pills */}
      <div className="max-w-4xl mx-auto px-6 overflow-x-auto flex gap-2 py-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition shadow-xs ${
              selectedCategory === cat ? 'bg-orange-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <main className="max-w-4xl mx-auto px-6 mt-2 space-y-3">
        {displayedItems.map((item) => {
          const cartKey = `${item.restaurant}-${item.name}`;
          const currentQty = userCart[cartKey]?.quantity || 0;
          return (
            <div key={cartKey} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-xl shadow-inner">
                  🍔
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-md mt-0.5">
                    {item.restaurant}
                  </span>
                  <p className="text-sm font-extrabold text-orange-600 mt-1">{item.price.toFixed(2)} Br</p>
                </div>
              </div>

              {currentQty === 0 ? (
                <button
                  onClick={() => updateQuantity(item, 1)}
                  className="px-5 py-2.5 border-2 border-orange-600 text-orange-600 font-bold text-sm rounded-xl hover:bg-orange-50 transition shadow-xs"
                >
                  + Add
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-orange-50 px-3 py-2 rounded-xl border border-orange-200">
                  <button onClick={() => updateQuantity(item, -1)} className="text-orange-600 font-extrabold px-1.5 text-base">−</button>
                  <span className="font-bold text-gray-900 text-sm w-4 text-center">{currentQty}</span>
                  <button onClick={() => updateQuantity(item, 1)} className="text-orange-600 font-extrabold px-1.5 text-base">+</button>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Floating Bottom Cart Bar */}
      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-40">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md h-16 px-6 rounded-full shadow-2xl flex items-center justify-between border border-gray-200">
          <div className="relative flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full text-orange-700 font-bold">
            🛒
            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {totalItemCount}
            </span>
          </div>
          <span className="font-extrabold text-gray-900 text-base">{finalTotalPrice.toFixed(2)} Br</span>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-7 py-2.5 rounded-full transition text-sm shadow-md"
          >
            Buy now
          </button>
        </div>
      </div>

      {/* Checkout Menu Drawer / Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold text-gray-900">Active Checkout Summary</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✕</button>
            </div>

            {/* Delivery details inputs */}
            <div className="space-y-3 mb-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Address (Bole Area)</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="e.g. Bole Medhanialem, near Edna Mall"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
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
                <p className="text-center text-gray-400 py-8 text-sm">Your cart is currently empty</p>
              ) : (
                Object.values(userCart).map((entry) => {
                  const cartKey = `${entry.item.restaurant}-${entry.item.name}`;
                  return (
                    <div key={cartKey} className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs">
                      <div className="flex-1 pr-2">
                        <h4 className="font-bold text-sm text-gray-900">{entry.item.name}</h4>
                        <p className="text-[10px] text-orange-600 font-semibold">{entry.item.restaurant}</p>
                        <p className="text-xs text-gray-500">{entry.item.price.toFixed(2)} Br each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(entry.item, -1)} className="w-7 h-7 bg-gray-50 border border-gray-300 rounded-lg text-orange-600 font-bold flex items-center justify-center shadow-2xs">−</button>
                        <span className="text-sm font-bold w-4 text-center">{entry.quantity}</span>
                        <button onClick={() => updateQuantity(entry.item, 1)} className="w-7 h-7 bg-gray-50 border border-gray-300 rounded-lg text-orange-600 font-bold flex items-center justify-center shadow-2xs">+</button>
                      </div>
                      <span className="font-extrabold text-sm text-gray-900 ml-4 w-20 text-right">
                        {(entry.item.price * entry.quantity).toFixed(2)} Br
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 mt-3">
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>Subtotal</span>
                <span>{subtotalPrice.toFixed(2)} Br</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>Kitchen Prep Tax (10%)</span>
                <span>{kitchenPrepTax.toFixed(2)} Br</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>Bole Delivery Fee</span>
                <span>{totalItemCount > 0 ? `${deliveryFee.toFixed(2)} Br` : '0.00 Br'}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-orange-600">{finalTotalPrice.toFixed(2)} Br</span>
              </div>
            </div>

            <button
              disabled={Object.keys(userCart).length === 0}
              onClick={handleConfirmOrder}
              className="w-full mt-5 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-extrabold rounded-2xl transition shadow-md text-sm"
            >
              Submit Order Now 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}