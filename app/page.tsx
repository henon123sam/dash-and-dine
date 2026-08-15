'use client';

import React, { useState, useEffect } from 'react';

export default function App() {
  const [mainTab, setMainTab] = useState('dine');
  const [dineCategory, setDineCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Dash tab extended states
  const [pickupLocation, setPickupLocation] = useState('Bole Medhanialem, Addis Ababa');
  const [destinationLocation, setDestinationLocation] = useState('Piazza, Addis Ababa');
  const [tripActive, setTripActive] = useState(false);
  const [rideType, setRideType] = useState('standard');
  const [driverAssigned, setDriverAssigned] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);

  // User profile / wallet state
  const [userBalance, setUserBalance] = useState(1250);
  const [activePromo, setActivePromo] = useState('DINE50');
  const [promoApplied, setPromoApplied] = useState(true);

  // Extended Menu Dataset to ensure full depth
  const menuItems = [
    { id: 1, name: 'Doro Wat Classic', category: 'Traditional', price: 450, prepTime: '25 mins', rating: 4.9, reviewsCount: 312, description: 'Slow-cooked chicken stew with berbere, hard-boiled egg, and clarified butter served on fresh injera.', image: '🍲', available: true },
    { id: 2, name: 'Kitfo Special', category: 'Traditional', price: 500, prepTime: '20 mins', rating: 4.8, reviewsCount: 245, description: 'Minced lean beef warmed in mitmita and niter kibbeh, served raw, medium, or well-done with kocho.', image: '🥩', available: true },
    { id: 3, name: 'Tibs Firfir', category: 'Traditional', price: 380, prepTime: '15 mins', rating: 4.7, reviewsCount: 198, description: 'Tender cubed beef sautéed with onions, garlic, rosemary, and jalapeños, mixed with injera pieces.', image: '🥘', available: true },
    { id: 4, name: 'Shiro Beyaynetu', category: 'Vegetarian', price: 280, prepTime: '15 mins', rating: 4.9, reviewsCount: 410, description: 'Smooth spiced chickpea puree accompanied by a variety of fasting vegetable side dishes.', image: '🍛', available: true },
    { id: 5, name: 'Beyaynetu Deluxe', category: 'Vegetarian', price: 350, prepTime: '15 mins', rating: 4.9, reviewsCount: 520, description: 'Comprehensive platter of assorted vegetarian wats, lentils, shiro, and greens over multiple injera layers.', image: '🥗', available: true },
    { id: 6, name: 'Mega Smash Burger', category: 'Fast Food', price: 420, prepTime: '20 mins', rating: 4.8, reviewsCount: 380, description: 'Double beef patties with melted cheddar, crispy bacon, caramelized onions, and signature house sauce.', image: '🍔', available: true },
    { id: 7, name: 'Crispy Chicken Burger', category: 'Fast Food', price: 390, prepTime: '18 mins', rating: '4.6', reviewsCount: 215, description: 'Crunchy fried chicken breast coated in spicy glaze, topped with coleslaw and pickles.', image: '🍗', available: true },
    { id: 8, name: 'Pepperoni Inferno Pizza', category: 'Fast Food', price: 650, prepTime: '30 mins', rating: 4.9, reviewsCount: 430, description: 'Generous layers of spicy pepperoni, mozzarella cheese, hot honey drizzle, and fresh basil.', image: '🍕', available: true },
    { id: 9, name: 'Margherita Fresca', category: 'Fast Food', price: 520, prepTime: '25 mins', rating: 4.5, reviewsCount: 160, description: 'Classic Italian pizza with San Marzano tomato sauce, fresh mozzarella, and basil leaves.', image: '🧀', available: true },
    { id: 10, name: 'Iced Caramel Macchiato', category: 'Drinks', price: 180, prepTime: '10 mins', rating: 4.9, reviewsCount: 610, description: 'Espresso poured over iced milk with a sweet caramel drizzle and silky foam layer.', image: '🧋', available: true },
    { id: 11, name: 'Fresh Mango Juice', category: 'Drinks', price: 150, prepTime: '10 mins', rating: 4.8, reviewsCount: 450, description: '100% pure, thick, and refreshing tropical mango fruit juice blended with ice.', image: '🥭', available: true },
    { id: 12, name: 'Classic Mojito (Mocktail)', category: 'Drinks', price: 200, prepTime: '12 mins', rating: 4.7, reviewsCount: 230, description: 'Muddled fresh mint leaves, lime juice, cane sugar, and sparkling soda over crushed ice.', image: '🍹', available: true },
    { id: 13, name: 'Chocolate Lava Cake', category: 'Desserts', price: 250, prepTime: '15 mins', rating: 4.9, reviewsCount: 340, description: 'Warm chocolate cake with a molten gooey center, served alongside vanilla bean ice cream.', image: '🍰', available: true },
    { id: 14, name: 'Tiramisu Italiano', category: 'Desserts', price: 300, prepTime: '10 mins', rating: 4.8, reviewsCount: 180, description: 'Layers of espresso-soaked ladyfingers and rich mascarpone cream dusted with dark cocoa powder.', image: '🍮', available: true }
  ];

  const categories = ['All', 'Traditional', 'Vegetarian', 'Fast Food', 'Drinks', 'Desserts'];

  const driversList = [
    { name: 'Samuel K.', car: 'Toyota Vitz (White)', plate: 'A-42911', rating: 4.9, trips: 1420, phone: '+251 91 234 5678' },
    { name: 'Dawit M.', car: 'Hyundai Atos (Silver)', plate: 'B-88320', rating: 4.8, trips: 980, phone: '+251 92 345 6789' },
    { name: 'Edom T.', car: 'Toyota Corolla (Black)', plate: 'C-11045', rating: 4.95, trips: 2150, phone: '+251 93 456 7890' }
  ];

  const addNotification = (msg) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const filteredMenu = menuItems.filter(item => {
    const matchesCategory = dineCategory === 'All' || item.category === dineCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(c => c.id === item.id);
      if (existing) {
        return prevCart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    addNotification(`Added ${item.name} to cart!`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(c => {
        if (c.id === id) {
          const newQty = c.quantity + delta;
          return newQty > 0 ? { ...c, quantity: newQty } : null;
        }
        return c;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(c => c.id !== id));
    addNotification('Item removed from cart.');
  };

  const getTotalCartItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getDiscount = () => promoApplied && getSubtotal() > 0 ? 50 : 0;
  const getDeliveryFee = () => getSubtotal() > 0 ? 60 : 0;
  const getTotalCartPrice = () => {
    const sub = getSubtotal();
    if (sub === 0) return 0;
    return Math.max(0, sub - getDiscount() + getDeliveryFee());
  };

  const handleRequestRide = () => {
    if (!tripActive) {
      const randomDriver = driversList[Math.floor(Math.random() * driversList.length)];
      setDriverAssigned(randomDriver);
      setTripActive(true);
      addNotification(`Dash ride requested! Driver ${randomDriver.name} is on the way.`);
    } else {
      setTripActive(false);
      setDriverAssigned(null);
      addNotification('Ride cancelled successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-red-600 selection:text-white pb-24 relative">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-black tracking-wide border border-neutral-800 animate-bounce pointer-events-auto flex items-center space-x-2">
            <span>✨</span>
            <span>{n.msg}</span>
          </div>
        ))}
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setMainTab('dine')}>
            <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/30">
              D
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-neutral-900 block leading-tight">Dine & Dash</span>
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block">Addis Ababa Hub</span>
            </div>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-2 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/60">
            <button
              onClick={() => setMainTab('dine')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                mainTab === 'dine' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              🍽️ Dine Menu
            </button>
            <button
              onClick={() => setMainTab('dash')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                mainTab === 'dash' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              🚗 Dash Ride
            </button>
            <button
              onClick={() => setMainTab('cart')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all relative ${
                mainTab === 'cart' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              🛒 Cart
              {getTotalCartItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-md shadow-red-600/40 animate-pulse">
                  {getTotalCartItems()}
                </span>
              )}
            </button>
            <button
              onClick={() => setMainTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                mainTab === 'profile' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              👤 Profile
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* --- DINE SECTION --- */}
        {mainTab === 'dine' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="space-y-2 z-10">
                <span className="text-xs font-extrabold px-3 py-1 bg-red-600/30 border border-red-500/30 text-red-400 rounded-full uppercase tracking-wider">Fast Delivery & Dine</span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Delicious food, delivered fast.</h1>
                <p className="text-xs sm:text-sm text-neutral-300 font-medium max-w-lg">Explore authentic local dishes, gourmet burgers, fresh pizzas, and refreshing drinks across Addis Ababa.</p>
              </div>
              <div className="z-10 w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search dishes, drinks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-semibold text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDineCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all border ${
                    dineCategory === cat
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMenu.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-neutral-200 shadow-sm">
                  <span className="text-4xl mb-3 block">🔍</span>
                  <h3 className="text-base font-black text-neutral-800 mb-1">No items found</h3>
                  <p className="text-xs text-neutral-500">Try adjusting your search query or selecting a different category.</p>
                </div>
              ) : (
                filteredMenu.map((item) => {
                  const inCart = cart.find(c => c.id === item.id);
                  return (
                    <div key={item.id} className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-4xl p-3 bg-neutral-50 rounded-2xl border border-neutral-100">{item.image}</span>
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-extrabold px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full mb-1">
                              {item.category}
                            </span>
                            <span className="text-[10px] font-bold text-amber-600">★ {item.rating} ({item.reviewsCount})</span>
                          </div>
                        </div>
                        <h3 className="text-base font-black text-neutral-900 mb-1">{item.name}</h3>
                        <p className="text-xs text-neutral-500 font-medium mb-3 leading-relaxed">{item.description}</p>
                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100 inline-block mb-4">
                          ⏱️ Prep: {item.prepTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                        <span className="text-base font-black text-neutral-900">{item.price} ETB</span>
                        {inCart ? (
                          <div className="flex items-center space-x-2 bg-neutral-100 p-1 rounded-xl">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 bg-white rounded-lg shadow-sm font-bold text-neutral-800 flex items-center justify-center hover:bg-neutral-50"
                            >
                              -
                            </button>
                            <span className="text-xs font-black px-2">{inCart.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 bg-white rounded-lg shadow-sm font-bold text-neutral-800 flex items-center justify-center hover:bg-neutral-50"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow transition"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- DASH SECTION --- */}
        {mainTab === 'dash' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Dash Ride Service</h2>
              <p className="text-xs text-neutral-500 font-medium">Fast urban transit across Addis Ababa with real-time tracking.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">Book Your Ride</h3>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Pickup Location</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Destination</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                      value={destinationLocation}
                      onChange={(e) => setDestinationLocation(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Vehicle Tier</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['standard', 'comfort', 'xl'].map((tier) => (
                        <button
                          key={tier}
                          onClick={() => setRideType(tier)}
                          className={`py-2 rounded-xl text-[10px] font-black uppercase border transition ${
                            rideType === tier ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                    <div className="flex justify-between text-xs font-medium text-neutral-600">
                      <span>Estimated Fare:</span>
                      <span className="font-bold text-neutral-900">{rideType === 'standard' ? '350 ETB' : rideType === 'comfort' ? '480 ETB' : '650 ETB'}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-neutral-600">
                      <span>Estimated Time:</span>
                      <span className="font-bold text-neutral-900">18 mins</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRequestRide}
                  className={`w-full py-3 font-extrabold text-xs rounded-xl shadow transition ${
                    tripActive ? 'bg-neutral-900 hover:bg-neutral-800 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {tripActive ? 'Cancel Ride' : 'Request Dash Ride'}
                </button>
              </div>

              <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[380px]">
                <div className="flex justify-between items-center z-10">
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">Live Route Simulation</h3>
                    <p className="text-xs text-neutral-500 font-medium">Addis Ababa City Transit</p>
                  </div>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    tripActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {tripActive ? '🚗 Ride in Progress' : '🔍 Searching for Driver'}
                  </span>
                </div>

                <div className="my-6 bg-neutral-900 rounded-2xl p-6 flex-1 flex flex-col items-center justify-center relative border border-neutral-800 shadow-inner">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-md gap-4 z-10">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wider">Pickup</span>
                      <span className="text-xs font-extrabold text-white">{pickupLocation}</span>
                    </div>

                    <div className="flex-1 flex items-center justify-center w-full">
                      <div className="w-full h-0.5 bg-red-600 relative">
                        <div className={`absolute top-1/2 -translate-y-1/2 text-xl transition-all duration-1000 ${
                          tripActive ? 'left-full animate-pulse' : 'left-1/2'
                        }`}>
                          🚗
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wider">Destination</span>
                      <span className="text-xs font-extrabold text-white">{destinationLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-neutral-500 font-medium z-10 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                  <span>Driver: {driverAssigned ? `${driverAssigned.name} (${driverAssigned.car})` : 'Assigning driver...'}</span>
                  <span>{driverAssigned ? `Rating: ★ ${driverAssigned.rating} (${driverAssigned.phone})` : 'Waiting...'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CART SECTION --- */}
        {mainTab === 'cart' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Your Order Cart</h2>
              <p className="text-xs text-neutral-500 font-medium">Review your selected items before checkout.</p>
            </div>

            {cart.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 shadow-sm">
                <span className="text-5xl mb-3 block">🛒</span>
                <h3 className="text-base font-black text-neutral-800 mb-1">Your cart is currently empty</h3>
                <p className="text-xs text-neutral-500 mb-6">Explore the Dine menu to add delicious meals and drinks.</p>
                <button
                  onClick={() => setMainTab('dine')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow transition"
                >
                  Browse Dine Menu
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl p-3 bg-neutral-50 rounded-2xl border border-neutral-100">{item.image}</span>
                        <div>
                          <h3 className="text-sm font-black text-neutral-900">{item.name}</h3>
                          <p className="text-xs text-neutral-500 font-medium">{item.price} ETB each</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-neutral-100 p-1 rounded-xl">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 bg-white rounded-lg shadow-sm font-bold text-neutral-800 flex items-center justify-center hover:bg-neutral-50"
                          >
                            -
                          </button>
                          <span className="text-xs font-black px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 bg-white rounded-lg shadow-sm font-bold text-neutral-800 flex items-center justify-center hover:bg-neutral-50"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-black text-neutral-900 w-20 text-right">{item.price * item.quantity} ETB</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-600 font-bold text-sm transition p-1"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4 h-fit">
                  <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">Order Summary</h3>
                  
                  <div className="space-y-2 py-3 border-y border-neutral-100 text-xs font-medium text-neutral-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-neutral-900">{getSubtotal()} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Promo Discount ({activePromo})</span>
                      <span className="font-bold text-green-600">-{getDiscount()} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-bold text-neutral-900">{getDeliveryFee()} ETB</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm font-black text-neutral-900">
                    <span>Total</span>
                    <span className="text-lg text-red-600">{getTotalCartPrice()} ETB</span>
                  </div>

                  <button
                    onClick={() => {
                      const total = getTotalCartPrice();
                      if (userBalance < total) {
                        alert('Insufficient wallet balance! Please top up.');
                        return;
                      }
                      setUserBalance(prev => prev - total);
                      alert(`Order successfully placed! Paid ${total} ETB from your wallet. Thank you for using Dine & Dash!`);
                      setCart([]);
                    }}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow transition"
                  >
                    Confirm & Pay ({getTotalCartPrice()} ETB)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- PROFILE / WALLET SECTION --- */}
        {mainTab === 'profile' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">User Profile & Wallet</h2>
              <p className="text-xs text-neutral-500 font-medium">Manage your balance, promo codes, and account preferences.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md">
                  HS
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-900">Henon Samuel</h3>
                  <p className="text-xs text-neutral-500 font-medium">henon.samuel@example.com • Addis Ababa</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Wallet Balance</span>
                  <span className="text-xl font-black text-neutral-900">{userBalance} ETB</span>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Active Promo</span>
                  <span className="text-xl font-black text-red-600">{activePromo}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider">Quick Top Up Wallet</h4>
                <div className="flex space-x-3">
                  {[200, 500, 1000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => {
                        setUserBalance(prev => prev + amount);
                        addNotification(`Successfully added ${amount} ETB to wallet!`);
                      }}
                      className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-black shadow transition"
                    >
                      +{amount} ETB
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}