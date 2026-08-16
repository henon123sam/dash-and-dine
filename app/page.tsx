'client-side';
import React, { useState, useEffect } from 'react';

// ==========================================
// DINE & DASH: ULTIMATE SUPER-APP ENGINE
// COMBINING DOORDASH, UBER & UBER EATS
// ==========================================

export default function DineAndDashSuperApp() {
  // --- CORE APP & NAVIGATION STATES ---
  const [currentUser] = useState("Henon Samuel");
  const [activeTab, setActiveTab] = useState('feed'); // 'feed', 'store', 'cart', 'rides', 'tracker', 'wallet', 'profile'
  const [serviceMode, setServiceMode] = useState('delivery'); // 'delivery', 'pickup', 'ride'
  const [deliveryAddress, setDeliveryAddress] = useState('Bole Medhanialem, Kirkos, Addis Ababa');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // --- CART & ORDER STATES ---
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [tipAmount, setTipAmount] = useState(30);
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  // --- RIDE HILING STATES ---
  const [ridePickup, setRidePickup] = useState('Bole International Airport (ADD)');
  const [rideDropoff, setRideDropoff] = useState('Piazza, Arada, Addis Ababa');
  const [rideTier, setRideTier] = useState('comfort'); // 'economy', 'comfort', 'xl', 'moto'
  const [activeRide, setActiveRide] = useState(null);

  // --- WALLET & REWARDS STATES ---
  const [walletBalance, setWalletBalance] = useState(1450.00); // ETB
  const [dashPassActive, setDashPassActive] = useState(true);
  const [rewardPoints, setRewardPoints] = useState(3420);

  // --- ACTIVE STORE VIEW ---
  const [selectedStore, setSelectedStore] = useState(null);
  const [itemModal, setItemModal] = useState(null); // Customizing item options
  const [customizations, setCustomizations] = useState({ size: 'Regular', extras: [], notes: '' });

  // ==========================================
  // MOCK DATABASE: RESTAURANTS, STORES & SERVICES
  // ==========================================
  const categories = [
    { id: 'All', name: 'All Cuisines', icon: '🌟' },
    { id: 'Traditional', name: 'Ethiopian Tradition', icon: ' injera ' },
    { id: 'FastFood', name: 'Burgers & Fries', icon: '🍔' },
    { id: 'Pizza', name: 'Pizzas & Italian', icon: '🍕' },
    { id: 'Cafe', name: 'Coffee & Bakery', icon: '☕' },
    { id: 'Groceries', name: 'Grocery & Market', icon: '🛒' },
    { id: 'Pharmacy', name: 'Health & Pharmacy', icon: '💊' },
  ];

  const stores = [
    {
      id: 'store-1',
      name: 'Tomoca Coffee HQ & Roastery',
      category: 'Cafe',
      rating: 4.9,
      reviewsCount: '2.4k',
      deliveryTime: '15-25 min',
      deliveryFee: 25,
      dashPassEligible: true,
      image: '☕',
      bannerImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=60',
      description: 'Legendary Ethiopian espresso, macchiatos, and fresh pastries.',
      menu: [
        { id: 'm1', name: 'Double Tomoca Macchiato', price: 65, category: 'Drinks', description: 'Bold, traditional dark-roasted espresso with rich velvety foam.', image: '☕' },
        { id: 'm2', name: 'Fresh Butter Croissant', price: 80, category: 'Bakery', description: 'Flaky, buttery pastry baked fresh every morning.', image: '🥐' },
        { id: 'm3', name: 'Iced Caramel Frappe', price: 130, category: 'Drinks', description: 'Blended espresso with caramel drizzle and fresh milk.', image: '🥤' }
      ]
    },
    {
      id: 'store-2',
      name: 'Habesha Traditional Feast',
      category: 'Traditional',
      rating: 4.8,
      reviewsCount: '4.1k',
      deliveryTime: '25-40 min',
      deliveryFee: 40,
      dashPassEligible: true,
      image: '🍲',
      bannerImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60',
      description: 'Authentic Doro Wat, Kitfo, and massive family platters.',
      menu: [
        { id: 'm4', name: 'Special Doro Wat Combo', price: 480, category: 'Mains', description: 'Slow-simmered spicy chicken stew with hard-boiled eggs, cottage cheese, and honey wine reduction.', image: '🍲' },
        { id: 'm5', name: 'Gursha Kitfo Special', price: 520, category: 'Mains', description: 'Minced lean beef warmed in spiced clarified butter (mitmita & kocho).', image: '🥩' },
        { id: 'm6', name: 'Vegetarian Fasting Platter', price: 350, category: 'Mains', description: 'Assorted lentils, shiro, collard greens, and cabbage over injera.', image: '🥗' }
      ]
    },
    {
      id: 'store-3',
      name: 'Burger & Shake House',
      category: 'FastFood',
      rating: 4.7,
      reviewsCount: '1.8k',
      deliveryTime: '20-30 min',
      deliveryFee: 35,
      dashPassEligible: true,
      image: '🍔',
      bannerImage: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=60',
      description: 'Smash burgers, loaded curly fries, and thick Oreo shakes.',
      menu: [
        { id: 'm7', name: 'The Ultimate Dash Burger', price: 390, category: 'Burgers', description: 'Dual beef patties, melted cheddar, smoky bacon, caramelized onions, and secret Dash sauce.', image: '🍔' },
        { id: 'm8', name: 'Loaded Truffle Fries', price: 210, category: 'Sides', description: 'Crispy golden fries tossed in truffle oil and parmesan cheese.', image: '🍟' },
        { id: 'm9', name: 'Triple Chocolate Milkshake', price: 190, category: 'Drinks', description: 'Rich Belgian chocolate shake topped with whipped cream.', image: '🥤' }
      ]
    },
    {
      id: 'store-4',
      name: 'Pizza Italia Artisan Crust',
      category: 'Pizza',
      rating: 4.9,
      reviewsCount: '3.5k',
      deliveryTime: '30-45 min',
      deliveryFee: 45,
      dashPassEligible: false,
      image: '🍕',
      bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60',
      description: 'Wood-fired Neapolitan pizzas with imported Italian buffalo mozzarella.',
      menu: [
        { id: 'm10', name: 'Truffle Mushroom Pizza', price: 680, category: 'Pizzas', description: 'Wild mushrooms, truffle cream paste, mozzarella, and fresh arugula.', image: '🍕' },
        { id: 'm11', name: 'Spicy Diavola', price: 620, category: 'Pizzas', description: 'Italian spicy salami, fresh chili peppers, San Marzano tomatoes, and basil.', image: '🍕' }
      ]
    }
  ];

  // Ride options
  const rideTiers = [
    { id: 'moto', name: 'Dash Moto', desc: 'Beat Addis traffic on a secure motorcycle', eta: '3 min', price: 90, icon: '🛵' },
    { id: 'economy', name: 'Dash Economy', desc: 'Affordable everyday rides (Toyota Corolla/Vitz)', eta: '5 min', price: 220, icon: '🚗' },
    { id: 'comfort', name: 'Dash Comfort', desc: 'Newer cars with top-rated experienced drivers', eta: '4 min', price: 340, icon: '🚘' },
    { id: 'xl', name: 'Dash XL Vans', desc: 'Spacious 6-seater vehicles for groups or luggage', eta: '8 min', price: 550, icon: '🚐' }
  ];

  // ==========================================
  // CART & CHECKOUT LOGIC
  // ==========================================
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = selectedStore?.dashPassEligible && dashPassActive ? 0 : (selectedStore?.deliveryFee || 30);
  const discountAmount = (subtotal * appliedDiscount);
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee + tipAmount);

  const addToCartWithCustomization = (item, store) => {
    if (selectedStore && selectedStore.id !== store.id) {
      if (!window.confirm("Start a new cart? Adding items from a different store will clear your current cart.")) {
        return;
      }
      setCart([]);
    }
    setSelectedStore(store);
    const cartItemKey = `${item.id}-${customizations.size}-${customizations.extras.join(',')}`;
    const existingIndex = cart.findIndex(c => c.cartKey === cartItemKey);

    const itemPrice = customizations.size === 'Large' ? item.price * 1.25 : item.price;

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, {
        ...item,
        cartKey: cartItemKey,
        price: Math.round(itemPrice),
        quantity: 1,
        selectedOptions: { ...customizations }
      }]);
    }
    setItemModal(null);
    setCustomizations({ size: 'Regular', extras: [], notes: '' });
  };

  const updateCartQuantity = (cartKey, delta) => {
    setCart(cart.map(item => {
      if (item.cartKey === cartKey) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'DINEANDDASH2026') {
      setAppliedDiscount(0.20);
      alert('🎉 20% Discount applied successfully!');
    } else if (promoCode.toUpperCase() === 'DASHPASS') {
      setAppliedDiscount(0.15);
      alert('✨ 15% VIP DashPass discount applied!');
    } else {
      alert('❌ Invalid promo code. Try "DINEANDDASH2026"');
    }
  };

  const checkoutOrder = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: 'DD-' + Math.floor(100000 + Math.random() * 900000),
      storeName: selectedStore?.name || 'Dine & Dash Hub',
      items: [...cart],
      total: finalTotal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Preparing your order',
      driver: { name: 'Dawit M.', rating: 4.9, car: 'Toyota Vitz • Plate 3-89102', phone: '+251 91 123 4567' }
    };
    setActiveOrder(newOrder);
    setOrderHistory([newOrder, ...orderHistory]);
    setCart([]);
    setActiveTab('tracker');
  };

  // ==========================================
  // RIDE BOOKING LOGIC
  // ==========================================
  const requestRide = () => {
    const tierObj = rideTiers.find(t => t.id === rideTier);
    const newRide = {
      id: 'RIDE-' + Math.floor(10000 + Math.random() * 90000),
      tier: tierObj.name,
      pickup: ridePickup,
      dropoff: rideDropoff,
      fare: tierObj.price,
      status: 'Driver dispatched',
      driver: { name: 'Ephrem K.', rating: 4.95, car: 'Hyundai Elantra • Plate 2-99341', phone: '+251 92 456 7890', eta: '3 mins' }
    };
    setActiveRide(newRide);
    setActiveTab('tracker');
  };

  // ==========================================
  // RENDER UI COMPONENTS
  // ==========================================
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col selection:bg-red-600 selection:text-white">

      {/* --- TOP HEADER NAVIGATION --- */}
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-lg">
        
        {/* Brand & Address Selector */}
        <div className="flex items-center space-x-6">
          <div 
            onClick={() => { setActiveTab('feed'); setSelectedStore(null); }}
            className="cursor-pointer flex items-center space-x-2 group"
          >
            <div className="bg-red-600 text-white font-black px-3 py-1.5 rounded-2xl text-lg tracking-wider shadow-md group-hover:bg-red-500 transition">
              D&D
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-base tracking-tight text-white leading-none">DINE <span className="text-red-500">&</span> DASH</h1>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Ultimate Super-App</span>
            </div>
          </div>

          {/* Delivery Address Pill */}
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700/80 px-3.5 py-2 rounded-2xl border border-neutral-700/60 transition text-left"
          >
            <span className="text-red-500 text-sm">📍</span>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-extrabold flex items-center space-x-1">
                <span>Deliver to</span>
                <span className="text-red-400">▼</span>
              </div>
              <p className="text-xs font-bold text-neutral-200 truncate max-w-[180px] sm:max-w-[260px]">{deliveryAddress}</p>
            </div>
          </button>
        </div>

        {/* Mode Switcher: Delivery vs Pickup vs Ride */}
        <div className="hidden md:flex bg-neutral-950 p-1 rounded-2xl border border-neutral-800">
          {[
            { id: 'delivery', label: 'Delivery', icon: '🛵' },
            { id: 'pickup', label: 'Pickup', icon: '🛍️' },
            { id: 'ride', label: 'Rides', icon: '🚗' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => {
                setServiceMode(m.id);
                if (m.id === 'ride') setActiveTab('rides');
                else if (activeTab === 'rides') setActiveTab('feed');
              }}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold transition ${
                serviceMode === m.id ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* User Actions & Cart / Wallet */}
        <div className="flex items-center space-x-3">
          
          {/* Wallet Balance Badge */}
          <button 
            onClick={() => setActiveTab('wallet')}
            className="hidden sm:flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded-2xl border border-neutral-700/60 transition"
          >
            <span className="text-base">💳</span>
            <div className="text-left">
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-extrabold block leading-none">Wallet</span>
              <span className="text-xs font-black text-emerald-400">{walletBalance.toLocaleString()} ETB</span>
            </div>
          </button>

          {/* Active Tracker Button if Order/Ride exists */}
          {(activeOrder || activeRide) && (
            <button
              onClick={() => setActiveTab('tracker')}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-3 py-2 rounded-2xl text-xs font-black flex items-center space-x-1.5 shadow-lg animate-pulse"
            >
              <span>⚡</span>
              <span>Live Track</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setActiveTab('cart')}
            className="relative bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-2xl font-black text-xs flex items-center space-x-2 shadow-lg transition"
          >
            <span className="text-base">🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {cart.length > 0 && (
              <span className="bg-white text-red-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>

          {/* Profile Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-10 h-10 bg-gradient-to-tr from-red-600 to-amber-500 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-md hover:scale-105 transition"
            title={currentUser}
          >
            HS
          </button>

        </div>
      </header>

      {/* --- MAIN BODY CONTAINER --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">

        {/* ========================================== */}
        {/* VIEW 1: DISCOVER FEED (RESTAURANTS & STORES) */}
        {/* ========================================== */}
        {activeTab === 'feed' && !selectedStore && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Promotional Banner */}
            <div className="relative bg-gradient-to-r from-red-950 via-neutral-900 to-neutral-900 border border-red-900/40 rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 max-w-xl space-y-4">
                <span className="bg-red-600/30 text-red-400 text-xs font-black px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-widest">
                  DashPass Exclusive
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Zero Delivery Fees & <span className="text-red-500">20% Off</span> Everything!
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed">
                  Enjoy lightning-fast delivery from Addis Ababa's best restaurants, coffee shops, and grocery markets with real-time GPS tracking.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button 
                    onClick={() => { setSearchQuery('Traditional'); }}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xs transition shadow-lg"
                  >
                    Order Traditional Feast
                  </button>
                  <button 
                    onClick={() => setActiveTab('rides')}
                    className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-black text-xs transition border border-neutral-700"
                  >
                    Book a Dash Ride 🚗
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-96">
                  <span className="absolute left-4 top-3.5 text-neutral-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search restaurants, burgers, coffee, groceries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-600 transition shadow-inner"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                  <span className="text-xs font-bold text-neutral-400">Sort:</span>
                  <select className="bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2.5 text-xs font-bold text-neutral-200 focus:outline-none focus:border-red-600">
                    <option>Fastest Delivery</option>
                    <option>Highest Rated</option>
                    <option>Nearest You</option>
                  </select>
                </div>
              </div>

              {/* Categories Scroll */}
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition border ${
                      selectedCategory === cat.id 
                        ? 'bg-red-600 border-red-500 text-white shadow-lg' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {stores
                .filter(store => selectedCategory === 'All' || store.category === selectedCategory || store.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(store => (
                  <div
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-red-600/60 transition-all duration-300 shadow-xl group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Banner Image / Header */}
                      <div className="h-48 relative overflow-hidden bg-neutral-800">
                        <img 
                          src={store.bannerImage} 
                          alt={store.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                        
                        {store.dashPassEligible && (
                          <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            ⚡ DashPass $0 Delivery
                          </span>
                        )}

                        <span className="absolute bottom-3 left-4 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-extrabold text-neutral-200 border border-neutral-800 flex items-center space-x-1.5">
                          <span>⏱️</span>
                          <span>{store.deliveryTime}</span>
                        </span>
                      </div>

                      {/* Store Details */}
                      <div className="p-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-black text-xl text-white group-hover:text-red-500 transition">{store.name}</h3>
                          <div className="flex items-center space-x-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20 text-xs font-black">
                            <span>★</span>
                            <span>{store.rating}</span>
                            <span className="text-neutral-500 text-[10px]">({store.reviewsCount})</span>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-400 font-medium line-clamp-1">{store.description}</p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs font-bold text-neutral-400">
                      <span>Delivery: {store.deliveryFee} ETB</span>
                      <span className="text-red-500 font-extrabold group-hover:translate-x-1 transition flex items-center space-x-1">
                        <span>View Menu & Order</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 2: STORE MENU & ITEM CUSTOMIZER */}
        {/* ========================================== */}
        {activeTab === 'feed' && selectedStore && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Back Button & Store Header */}
            <button
              onClick={() => setSelectedStore(null)}
              className="text-xs font-extrabold text-neutral-400 hover:text-white flex items-center space-x-2 bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-800 transition"
            >
              <span>← Back to Restaurants</span>
            </button>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="h-64 relative">
                <img src={selectedStore.bannerImage} alt={selectedStore.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <span className="bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedStore.category}
                  </span>
                  <h2 className="text-3xl font-black text-white">{selectedStore.name}</h2>
                  <p className="text-xs text-neutral-300 font-medium">{selectedStore.description}</p>
                  <div className="flex items-center space-x-4 text-xs font-bold text-neutral-300 pt-1">
                    <span>★ {selectedStore.rating} ({selectedStore.reviewsCount} reviews)</span>
                    <span>•</span>
                    <span>⏱️ {selectedStore.deliveryTime}</span>
                    <span>•</span>
                    <span>Delivery: {selectedStore.deliveryFee} ETB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white">Menu Catalog</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedStore.menu.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setItemModal(item)}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 hover:border-red-600/60 transition cursor-pointer flex items-center justify-between shadow-md group"
                  >
                    <div className="space-y-2 pr-4">
                      <span className="text-3xl bg-neutral-800 p-3 rounded-2xl inline-block">{item.image}</span>
                      <h4 className="font-black text-base text-white group-hover:text-red-500 transition">{item.name}</h4>
                      <p className="text-xs text-neutral-400 font-medium line-clamp-2">{item.description}</p>
                      <p className="font-black text-sm text-red-500">{item.price} ETB</p>
                    </div>
                    <button className="w-10 h-10 bg-red-600/20 text-red-500 group-hover:bg-red-600 group-hover:text-white rounded-2xl flex items-center justify-center font-black transition">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 3: CART & CHECKOUT */}
        {/* ========================================== */}
        {activeTab === 'cart' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-white">Your Dash Cart</h2>
              <p className="text-xs text-neutral-400 font-medium">Review your items, apply promos, and place your order.</p>
            </div>

            {cart.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
                <span className="text-6xl">🛒</span>
                <h3 className="text-lg font-black text-white">Your cart is currently empty</h3>
                <p className="text-xs text-neutral-400">Add delicious meals or groceries from our top restaurants to get started.</p>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xs transition shadow-lg inline-block"
                >
                  Explore Restaurants
                </button>
              </div>
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                
                {/* Store Name Header */}
                <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-red-500 tracking-wider">Ordering from</span>
                    <h3 className="font-black text-lg text-white">{selectedStore?.name}</h3>
                  </div>
                  <button onClick={() => setCart([])} className="text-xs font-bold text-neutral-400 hover:text-red-500">
                    Clear Cart
                  </button>
                </div>

                {/* Items List */}
                <div className="divide-y divide-neutral-800">
                  {cart.map(item => (
                    <div key={item.cartKey} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl bg-neutral-800 p-2.5 rounded-2xl">{item.image}</span>
                        <div>
                          <h4 className="font-bold text-sm text-white">{item.name}</h4>
                          <span className="text-[11px] text-neutral-400">{item.price} ETB each • {item.selectedOptions?.size}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-neutral-800 p-1 rounded-xl border border-neutral-700">
                          <button onClick={() => updateCartQuantity(item.cartKey, -1)} className="w-6 h-6 bg-neutral-700 rounded-lg text-xs font-bold hover:bg-red-600 transition">-</button>
                          <span className="text-xs font-black px-1">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.cartKey, 1)} className="w-6 h-6 bg-neutral-700 rounded-lg text-xs font-bold hover:bg-red-600 transition">+</button>
                        </div>
                        <span className="font-black text-sm text-white w-20 text-right">{item.price * item.quantity} ETB</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code (e.g., DINEANDDASH2026)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                  />
                  <button onClick={applyPromoCode} className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-black transition">
                    Apply
                  </button>
                </div>

                {/* Tip Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Add Courier Tip</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[20, 30, 50, 80].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setTipAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-black transition border ${
                          tipAmount === amt ? 'bg-red-600 border-red-500 text-white' : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        {amt} ETB
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="border-t border-neutral-800 pt-4 space-y-2 text-xs font-semibold text-neutral-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal} ETB</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-red-500 font-bold">
                      <span>Promo Discount ({appliedDiscount * 100}%)</span>
                      <span>-{Math.round(discountAmount)} ETB</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee {dashPassActive && <span className="text-red-500 font-bold">(DashPass $0)</span>}</span>
                    <span>{deliveryFee} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courier Tip</span>
                    <span>{tipAmount} ETB</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-neutral-800">
                    <span>Total Amount</span>
                    <span className="text-red-500">{Math.round(finalTotal)} ETB</span>
                  </div>
                </div>

                <button
                  onClick={checkoutOrder}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-sm transition shadow-xl"
                >
                  Place Order ({Math.round(finalTotal)} ETB)
                </button>

              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 4: RIDE HAILING HUB */}
        {/* ========================================== */}
        {activeTab === 'rides' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-white">Dash Ride Hailing</h2>
              <p className="text-xs text-neutral-400 font-medium">Safe, reliable, and instant rides across Addis Ababa.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ride Form */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Pickup Location</label>
                    <input
                      type="text"
                      value={ridePickup}
                      onChange={(e) => setRidePickup(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Destination</label>
                    <input
                      type="text"
                      value={rideDropoff}
                      onChange={(e) => setRideDropoff(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  {/* Ride Tier Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Choose Ride Tier</label>
                    <div className="space-y-2">
                      {rideTiers.map(tier => (
                        <div
                          key={tier.id}
                          onClick={() => setRideTier(tier.id)}
                          className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                            rideTier === tier.id ? 'bg-red-600/10 border-red-500 text-white' : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{tier.icon}</span>
                            <div>
                              <h4 className="font-black text-xs text-white">{tier.name}</h4>
                              <p className="text-[10px] text-neutral-400">{tier.eta} away</p>
                            </div>
                          </div>
                          <span className="font-black text-sm text-red-500">{tier.price} ETB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={requestRide}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xs transition shadow-lg mt-4"
                >
                  Request Dash Ride Now
                </button>
              </div>

              {/* Map Mock & Radar */}
              <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col h-[500px] relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Live Radar & GPS Tracking</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20">
                    🟢 42 Drivers Nearby
                  </span>
                </div>

                {/* Map Graphics */}
                <div className="flex-1 bg-neutral-950 rounded-2xl relative flex items-center justify-center overflow-hidden border border-neutral-800">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                  <div className="absolute w-2/3 h-1.5 bg-gradient-to-r from-red-600 to-amber-500 rounded-full animate-pulse transform -rotate-6"></div>

                  {/* Pickup Pin */}
                  <div className="absolute left-1/4 top-1/3 flex flex-col items-center">
                    <span className="bg-neutral-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow mb-1 border border-neutral-800">Pickup</span>
                    <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
                  </div>

                  {/* Dropoff Pin */}
                  <div className="absolute right-1/4 bottom-1/3 flex flex-col items-center">
                    <span className="bg-neutral-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow mb-1 border border-neutral-800">Destination</span>
                    <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg"></div>
                  </div>

                  {/* Driver Car Icon Moving */}
                  <div className="absolute left-1/3 top-2/5 bg-white text-neutral-950 p-2 rounded-xl shadow-2xl font-black text-xs flex items-center space-x-1 animate-bounce">
                    <span>🚗</span>
                    <span>2 mins away</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 5: LIVE ORDER & RIDE TRACKER */}
        {/* ========================================== */}
        {activeTab === 'tracker' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-white">Live Activity Tracker</h2>
              <p className="text-xs text-neutral-400 font-medium">Watch your food or ride arrive in real-time.</p>
            </div>

            {activeOrder && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest">Active Order #{activeOrder.id}</span>
                    <h3 className="font-black text-xl text-white">{activeOrder.storeName}</h3>
                  </div>
                  <span className="bg-amber-500/10 text-amber-400 font-black text-xs px-3 py-1.5 rounded-xl border border-amber-500/20 animate-pulse">
                    ⚡ {activeOrder.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-neutral-400">
                    <span>Order Placed</span>
                    <span>Preparing</span>
                    <span className="text-red-500">Out for Delivery</span>
                    <span>Arrived</span>
                  </div>
                  <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                    <div className="bg-gradient-to-r from-red-600 to-amber-500 w-3/4 h-full rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Driver Card */}
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center font-black text-xl">
                      🚴‍♂️
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white">{activeOrder.driver.name}</h4>
                      <p className="text-xs text-neutral-400 font-medium">{activeOrder.driver.car}</p>
                      <p className="text-[10px] text-amber-400 font-bold mt-0.5">★ {activeOrder.driver.rating} Rating</p>
                    </div>
                  </div>

                  <a 
                    href={`tel:${activeOrder.driver.phone}`}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black transition shadow-md"
                  >
                    Call Driver
                  </a>
                </div>

                <button
                  onClick={() => setActiveOrder(null)}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-black text-xs transition"
                >
                  Mark Order as Received & Completed
                </button>
              </div>
            )}

            {activeRide && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest">Active Ride #{activeRide.id}</span>
                    <h3 className="font-black text-xl text-white">{activeRide.tier}</h3>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 font-black text-xs px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-pulse">
                    🟢 Driver Arriving in {activeRide.driver.eta}
                  </span>
                </div>

                {/* Driver Card */}
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center font-black text-xl">
                      🚗
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white">{activeRide.driver.name}</h4>
                      <p className="text-xs text-neutral-400 font-medium">{activeRide.driver.car}</p>
                      <p className="text-[10px] text-amber-400 font-bold mt-0.5">★ {activeRide.driver.rating} Verified Captain</p>
                    </div>
                  </div>

                  <a 
                    href={`tel:${activeRide.driver.phone}`}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition shadow-md"
                  >
                    Call Captain
                  </a>
                </div>

                <button
                  onClick={() => setActiveRide(null)}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-black text-xs transition"
                >
                  End Ride & Rate Captain
                </button>
              </div>
            )}

            {!activeOrder && !activeRide && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center space-y-3">
                <span className="text-5xl">⚡</span>
                <h3 className="text-base font-black text-white">No Active Orders or Rides</h3>
                <p className="text-xs text-neutral-400">Place an order or book a ride to view live GPS tracking here.</p>
                <button onClick={() => setActiveTab('feed')} className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black transition">
                  Explore App
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 6: WALLET & REWARDS */}
        {/* ========================================== */}
        {activeTab === 'wallet' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-white">Dash Wallet & Rewards</h2>
              <p className="text-xs text-neutral-400 font-medium">Manage your balance, loyalty rewards, and DashPass subscription.</p>
            </div>

            <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-neutral-900 border border-red-900/40 rounded-3xl p-8 shadow-2xl space-y-4">
              <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest">Available Balance</span>
              <h3 className="text-4xl font-black text-white">{walletBalance.toLocaleString()} <span className="text-red-500 text-xl">ETB</span></h3>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => { setWalletBalance(walletBalance + 1000); alert('Successfully added 1,000 ETB to wallet!'); }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xs transition shadow-lg"
                >
                  + Top Up 1,000 ETB
                </button>
                <button 
                  onClick={() => alert('DashPass VIP is active! Enjoy $0 delivery fees.')}
                  className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-black text-xs transition border border-neutral-700"
                >
                  Manage DashPass ({dashPassActive ? 'Active' : 'Inactive'})
                </button>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-black text-base text-white">Dash Rewards Points</h3>
              <div className="flex items-center justify-between bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">⭐</span>
                  <div>
                    <h4 className="font-black text-sm text-white">{rewardPoints} Points Available</h4>
                    <p className="text-xs text-neutral-400">Redeem points for free meals and ride discounts.</p>
                  </div>
                </div>
                <button onClick={() => alert('Successfully redeemed 500 points for a 100 ETB voucher!')} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-black text-xs rounded-xl transition">
                  Redeem Voucher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 7: USER PROFILE */}
        {/* ========================================== */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-white">Account Profile</h2>
              <p className="text-xs text-neutral-400 font-medium">Manage your personal information and preferences.</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-xl space-y-6">
              <div className="flex items-center space-x-4 border-b border-neutral-800 pb-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-600 to-amber-500 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-lg">
                  HS
                </div>
                <div>
                  <h3 className="font-black text-xl text-white">{currentUser}</h3>
                  <p className="text-xs text-neutral-400">henon.samuel@example.com • +251 91 234 5678</p>
                  <span className="inline-block mt-2 bg-red-600/20 text-red-500 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-red-500/30">
                    VIP Member
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-sm text-white">Order & Ride History ({orderHistory.length})</h4>
                {orderHistory.length === 0 ? (
                  <p className="text-xs text-neutral-500">No past orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orderHistory.map(ord => (
                      <div key={ord.id} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex items-center justify-between text-xs">
                        <div>
                          <h5 className="font-black text-white">{ord.storeName}</h5>
                          <p className="text-neutral-400">{ord.timestamp} • {ord.items.length} items</p>
                        </div>
                        <span className="font-black text-red-500">{Math.round(ord.total)} ETB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================== */}
      {/* MODAL 1: ITEM CUSTOMIZATION & ADD TO CART */}
      {/* ========================================== */}
      {itemModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between">
              <span className="text-4xl">{itemModal.image}</span>
              <button onClick={() => setItemModal(null)} className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-full font-black text-xs text-neutral-300">✕</button>
            </div>

            <div>
              <h3 className="font-black text-xl text-white">{itemModal.name}</h3>
              <p className="text-xs text-neutral-400 mt-1">{itemModal.description}</p>
              <p className="font-black text-lg text-red-500 mt-2">{itemModal.price} ETB</p>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Select Size</label>
              <div className="grid grid-cols-2 gap-2">
                {['Regular', 'Large'].map(sz => (
                  <button
                    key={sz}
                    onClick={() => setCustomizations({ ...customizations, size: sz })}
                    className={`py-2.5 rounded-xl text-xs font-black transition border ${
                      customizations.size === sz ? 'bg-red-600 border-red-500 text-white' : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {sz} {sz === 'Large' ? '(+25%)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Special Instructions</label>
              <input
                type="text"
                placeholder="e.g., extra spicy, no onions..."
                value={customizations.notes}
                onChange={(e) => setCustomizations({ ...customizations, notes: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
              />
            </div>

            <button
              onClick={() => addToCartWithCustomization(itemModal, selectedStore)}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xs transition shadow-lg"
            >
              Add to Cart • {customizations.size === 'Large' ? Math.round(itemModal.price * 1.25) : itemModal.price} ETB
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: ADDRESS SELECTOR */}
      {/* ========================================== */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xl text-white">Choose Delivery Address</h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-full font-black text-xs text-neutral-300">✕</button>
            </div>

            <div className="space-y-3">
              {[
                'Bole Medhanialem, Kirkos, Addis Ababa',
                'Piazza, Arada, Addis Ababa',
                'CMC Michael, Bole, Addis Ababa',
                'Kazanchis, Yeka, Addis Ababa'
              ].map(addr => (
                <div
                  key={addr}
                  onClick={() => { setDeliveryAddress(addr); setIsAddressModalOpen(false); }}
                  className={`p-4 rounded-2xl border cursor-pointer font-bold text-xs transition ${
                    deliveryAddress === addr ? 'bg-red-600/10 border-red-500 text-white' : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  📍 {addr}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}