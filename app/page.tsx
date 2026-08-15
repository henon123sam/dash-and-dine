"use client";

import { useState } from "react";
import LocationPicker from "./components/LocationPicker";
import AccountModal from "./components/AccountModal";

// --- MOCK DATA ---
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  category: string;
  items: MenuItem[];
}

const categories = [
  { name: "All", icon: "🔥" },
  { name: "Pizza", icon: "🍕" },
  { name: "Burgers", icon: "🍔" },
  { name: "Sushi", icon: "🍣" },
  { name: "Tacos", icon: "🌮" },
  { name: "Asian", icon: "🍜" },
];

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Slice House Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    rating: 4.8,
    deliveryTime: "20-30 min",
    deliveryFee: "$1.99",
    category: "Pizza",
    items: [
      { id: "p1", name: "Truffle Mushroom Pizza", price: 18.99, description: "Wild mushrooms, truffle oil, mozzarella, fresh thyme.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80" },
      { id: "p2", name: "Spicy Pepperoni Blast", price: 16.49, description: "Double pepperoni, hot honey drizzle, chili flakes.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&q=80" },
    ],
  },
  {
    id: "2",
    name: "Burger Craft",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    rating: 4.7,
    deliveryTime: "15-25 min",
    deliveryFee: "Free",
    category: "Burgers",
    items: [
      { id: "b1", name: "Double Smash Bacon Burger", price: 14.99, description: "Angus beef, aged cheddar, crispy bacon, secret sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80" },
      { id: "b2", name: "Crispy Truffle Fries", price: 6.99, description: "Hand-cut fries, parmesan, truffle garlic mayo.", image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=300&q=80" },
    ],
  },
  {
    id: "3",
    name: "Sakura Sushi Bar",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    rating: 4.9,
    deliveryTime: "25-35 min",
    deliveryFee: "$2.99",
    category: "Sushi",
    items: [
      { id: "s1", name: "Dragon Roll Deluxe", price: 19.50, description: "Eel, avocado, cucumber, unagi sauce, tobiko.", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80" },
      { id: "s2", name: "Salmon Nigiri Set (6pcs)", price: 15.00, description: "Fresh Atlantic salmon over seasoned sushi rice.", image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300&q=80" },
    ],
  },
];

const mockDashJobs = [
  { id: "j1", pickup: "Slice House Pizza", dropoff: "452 Broome St", payout: "$14.50", distance: "1.8 miles", estTime: "12 mins" },
  { id: "j2", pickup: "Burger Craft", dropoff: "88 Spring St", payout: "$18.20", distance: "2.4 miles", estTime: "16 mins" },
  { id: "j3", pickup: "Sakura Sushi Bar", dropoff: "120 Hudson St", payout: "$22.00", distance: "3.1 miles", estTime: "22 mins" },
];

export default function Home() {
  // Navigation & Mode States
  const [activeTab, setActiveTab] = useState<"dine" | "dash">("dine");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals & Drawers
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);

  // Cart State
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);

  // Saved Location
  const [location, setLocation] = useState({ label: "Home", address: "Select Delivery Location" });

  // Add Item to Cart
  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.item.id === item.id);
      if (existing) {
        return prevCart.map((c) => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prevCart, { item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

  // Filter Restaurants
  const filteredRestaurants = mockRestaurants.filter((res) => {
    const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pb-24">
      
      {/* --- MODALS --- */}
      <LocationPicker 
        isOpen={isLocationOpen} 
        onClose={() => setIsLocationOpen(false)} 
        onSelectLocation={(loc) => setLocation({ label: loc.label, address: loc.address })}
      />

      <AccountModal 
        isOpen={isAccountOpen} 
        onClose={() => setIsAccountOpen(false)} 
      />

      {/* --- TOP NAVIGATION BAR --- */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("dine")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-xl font-black shadow-lg shadow-red-900/40">
              ⚡
            </div>
            <span className="text-xl font-extrabold tracking-tight hidden sm:inline">
              Dash<span className="text-red-500">&</span>Dine
            </span>
          </div>

          {/* DINE vs DASH Mode Switcher Toggle */}
          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setActiveTab("dine")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition ${
                activeTab === "dine"
                  ? "bg-red-600 text-white shadow-md shadow-red-950"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <span>🍔</span>
              <span>Dine</span>
            </button>
            <button
              onClick={() => setActiveTab("dash")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition ${
                activeTab === "dash"
                  ? "bg-red-600 text-white shadow-md shadow-red-950"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <span>🚗</span>
              <span>Dash Driver</span>
            </button>
          </div>

          {/* User Profile & Cart Drawer Launcher */}
          <div className="flex items-center gap-3">
            {activeTab === "dine" && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-zinc-900 hover:bg-zinc-800 p-2.5 rounded-xl border border-zinc-800 text-white transition active:scale-95"
              >
                <span>🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsAccountOpen(true)}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-800 text-sm font-semibold transition"
            >
              <div className="w-6 h-6 rounded-full bg-red-600 text-xs font-bold flex items-center justify-center">
                AJ
              </div>
              <span className="hidden md:inline text-zinc-300">Account</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🍔 DINE MODE CONTENT */}
      {/* ========================================================================= */}
      {activeTab === "dine" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8 animate-in fade-in duration-300">
          
          {/* Location Delivery Selector Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 gap-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400">
                📍
              </div>
              <div>
                <p className="text-xs text-zinc-400 uppercase font-semibold">Delivering To</p>
                <p className="font-bold text-zinc-100 text-sm sm:text-base">
                  [{location.label}] {location.address}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLocationOpen(true)}
              className="w-full sm:w-auto bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-800/40 px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95"
            >
              Adjust Location & Map ✏️
            </button>
          </div>

          {/* Search Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-red-950/30 border border-zinc-800 p-8 sm:p-12 text-center space-y-6">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
              Crave it. <span className="text-red-500">Dash</span> it. Eat it.
            </h1>
            <p className="text-zinc-400 max-w-xl mx-auto text-base sm:text-lg">
              Fresh hot food delivered straight to your door from top local spots.
            </p>

            {/* Interactive Search Bar */}
            <div className="max-w-2xl mx-auto flex items-center bg-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl focus-within:border-red-500 transition">
              <span className="px-3 text-zinc-500 text-xl">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search spots, dishes, or cravings..."
                className="w-full bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="px-3 text-zinc-500 hover:text-white">✕</button>
              )}
            </div>
          </div>

          {/* Category Pills Slider */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-300">Popular Cuisines</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border whitespace-nowrap transition active:scale-95 ${
                    selectedCategory === cat.name
                      ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-950"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Restaurants Grid */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-wide">Featured Restaurants</h2>
              <span className="text-xs text-zinc-500">{filteredRestaurants.length} Places Nearby</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((res) => (
                <div
                  key={res.id}
                  className="bg-zinc-900 border border-zinc-800/90 rounded-2xl overflow-hidden hover:border-zinc-700 transition group cursor-pointer"
                  onClick={() => setActiveRestaurant(activeRestaurant?.id === res.id ? null : res)}
                >
                  <div className="relative h-48 w-full bg-zinc-950">
                    <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-zinc-700">
                      ⏱️ {res.deliveryTime}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition">{res.name}</h3>
                      <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-bold px-2 py-0.5 rounded-lg">
                        ★ {res.rating}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-zinc-400 font-medium">
                      <span>{res.category}</span>
                      <span>{res.deliveryFee === "Free" ? "Free Delivery" : `${res.deliveryFee} Delivery`}</span>
                    </div>

                    {/* Expand Menu Items Button */}
                    <button className="w-full mt-2 bg-zinc-800 hover:bg-red-600 text-zinc-200 hover:text-white py-2.5 rounded-xl font-bold text-xs transition border border-zinc-700/50">
                      {activeRestaurant?.id === res.id ? "Hide Menu 🔼" : "View Dishes & Order 🔽"}
                    </button>
                  </div>

                  {/* Expanded Menu Section */}
                  {activeRestaurant?.id === res.id && (
                    <div className="border-t border-zinc-800 bg-zinc-950 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Available Dishes</p>
                      {res.items.map((dish) => (
                        <div key={dish.id} className="flex justify-between items-center bg-zinc-900 p-3 rounded-xl border border-zinc-800/80">
                          <div>
                            <p className="font-bold text-sm text-white">{dish.name}</p>
                            <p className="text-xs text-zinc-400">{dish.description}</p>
                            <p className="text-xs font-bold text-red-400 mt-1">${dish.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(dish);
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-2 rounded-lg transition active:scale-95 whitespace-nowrap ml-2"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚗 DASH DRIVER MODE CONTENT */}
      {/* ========================================================================= */}
      {activeTab === "dash" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8 animate-in fade-in duration-300">
          
          {/* Driver Stats Dashboard Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase">Today's Earnings</p>
              <p className="text-3xl font-black text-emerald-400">$142.80</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase">Completed Dashes</p>
              <p className="text-3xl font-black text-white">8 Trips</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase">Driver Status</p>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-xl font-bold text-emerald-400">Online & Ready</p>
              </div>
            </div>
          </div>

          {/* Active Navigation Satellite Map */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Driver Live Radar Map</h2>
                <p className="text-xs text-zinc-400">Monitoring high-demand delivery zones near you</p>
              </div>
              <span className="bg-red-950 text-red-400 border border-red-800 text-xs font-bold px-3 py-1 rounded-full">
                Live Traffic GPS
              </span>
            </div>

            <div className="h-64 w-full rounded-xl overflow-hidden border border-zinc-800 relative">
              <iframe
                title="Driver Live Navigation Map"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=40.7128,-74.0060&z=14&output=embed`}
                className="filter contrast-[1.2] invert-[0.9] hue-rotate-180"
              ></iframe>
            </div>
          </div>

          {/* Live Delivery Offers */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Available Delivery Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockDashJobs.map((job) => (
                <div key={job.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 hover:border-red-600 transition">
                  <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                    <div>
                      <p className="text-xs font-bold text-red-400 uppercase">Est. Payout</p>
                      <p className="text-2xl font-black text-white">{job.payout}</p>
                    </div>
                    <span className="text-xs bg-zinc-800 text-zinc-300 font-semibold px-2.5 py-1 rounded-lg">
                      {job.distance}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p><span className="text-zinc-500">Pickup:</span> <strong className="text-zinc-200">{job.pickup}</strong></p>
                    <p><span className="text-zinc-500">Dropoff:</span> <strong className="text-zinc-200">{job.dropoff}</strong></p>
                  </div>

                  <button 
                    onClick={() => alert(`Delivery Order Accepted! Route sent to GPS.`)}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-md shadow-red-950 active:scale-95"
                  >
                    Accept Dash Task 🚀
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🛒 SLIDE-OVER CART DRAWER */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border-l border-zinc-800 text-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl">
            
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛒</span>
                  <h2 className="text-xl font-bold">Your Order Cart</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-white p-1 rounded-lg">✕</button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 space-y-2">
                  <p className="text-3xl">🍕</p>
                  <p className="font-bold">Your cart is currently empty</p>
                  <p className="text-xs">Add dishes from any restaurant to start an order.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map(({ item, quantity }) => (
                    <div key={item.id} className="flex justify-between items-center bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                      <div>
                        <p className="font-bold text-sm text-white">{item.name}</p>
                        <p className="text-xs text-red-400 font-semibold">${(item.price * quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-zinc-400">Qty: {quantity}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-zinc-800 pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Subtotal</span>
                  <span className="text-red-400">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    alert("Order Placed Successfully! Your Dash driver is en route.");
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3.5 rounded-xl transition shadow-lg shadow-red-950 active:scale-95"
                >
                  Checkout Now • ${cartTotal.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}