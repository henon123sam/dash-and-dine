'use client';
import React, { useState } from 'react';

export default function DineAndDashApp() {
  const [currentUser] = useState("Henon Samuel");
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedStore, setSelectedStore] = useState(null);
  
  // Cart state explicitly typed / initialized
  const [cart, setCart] = useState([]);
  const [itemModal, setItemModal] = useState(null);

  // Rides state
  const [ridePickup, setRidePickup] = useState('Bole Airport (ADD)');
  const [rideDropoff, setRideDropoff] = useState('Piazza, Addis Ababa');
  const [activeRide, setActiveRide] = useState(null);

  // Git Deploy state
  const [gitCommitMessage, setGitCommitMessage] = useState('fix: clean restart of dine and dash app');
  const [gitCommitCount, setGitCommitCount] = useState(150);
  const [gitLogs, setGitLogs] = useState([
    { id: 1, hash: 'a1b2c3d', msg: 'init: clean build initialization', time: 'Just now' }
  ]);
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  // Static Catalog
  const stores = [
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

  const addToCart = (item, store) => {
    if (selectedStore && selectedStore.id !== store.id) {
      if (!window.confirm("Switch store? This will reset your current cart.")) return;
      setCart([]);
    }
    setSelectedStore(store);
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setItemModal(null);
  };

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  const executeGitPush = () => {
    setIsPushing(true);
    setPushSuccess(false);
    setTimeout(() => {
      const hash = Math.random().toString(16).substring(2, 9);
      setGitLogs([{ id: gitLogs.length + 1, hash, msg: gitCommitMessage, time: 'Just now' }, ...gitLogs]);
      setGitCommitCount(gitCommitCount + 1);
      setIsPushing(false);
      setPushSuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col">
      {/* HEADER */}
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div onClick={() => { setActiveTab('feed'); setSelectedStore(null); }} className="cursor-pointer flex items-center space-x-2">
          <div className="bg-red-600 text-white font-black px-3 py-1 rounded-xl text-sm">D&D</div>
          <h1 className="font-black text-sm tracking-tight text-white">DINE <span className="text-red-500">&</span> DASH</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => setActiveTab('feed')} className={`px-3 py-1.5 rounded-xl text-xs font-black ${activeTab === 'feed' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}>Feed</button>
          <button onClick={() => setActiveTab('rides')} className={`px-3 py-1.5 rounded-xl text-xs font-black ${activeTab === 'rides' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}>Rides</button>
          <button onClick={() => setActiveTab('cart')} className={`px-3 py-1.5 rounded-xl text-xs font-black ${activeTab === 'cart' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</button>
          <button onClick={() => setActiveTab('git')} className={`px-3 py-1.5 rounded-xl text-xs font-black ${activeTab === 'git' ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}>⚡ git push</button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        {activeTab === 'feed' && !selectedStore && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white">Hello, {currentUser}!</h2>
              <p className="text-xs text-neutral-400 mt-1">Select a restaurant to view the menu.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stores.map(s => (
                <div key={s.id} onClick={() => setSelectedStore(s)} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden cursor-pointer hover:border-red-500 transition">
                  <div className="h-36 relative"><img src={s.banner} alt={s.name} className="w-full h-full object-cover" /></div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-sm text-white">{s.name}</h3>
                      <span className="text-[10px] text-neutral-400">⏱️ {s.deliveryTime}</span>
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
            <button onClick={() => setSelectedStore(null)} className="text-xs text-neutral-400 font-bold bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">← Back</button>
            <h2 className="text-xl font-black text-white">{selectedStore.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedStore.menu.map(item => (
                <div key={item.id} onClick={() => setItemModal(item)} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 cursor-pointer flex justify-between items-center hover:border-red-500">
                  <div>
                    <h4 className="font-black text-xs text-white">{item.name}</h4>
                    <p className="text-[10px] text-neutral-400">{item.desc}</p>
                    <p className="text-xs font-black text-red-500 mt-1">{item.price} ETB</p>
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
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-xs text-neutral-400">Cart is empty.</div>
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
                <button onClick={() => { alert('Order placed successfully!'); setCart([]); setActiveTab('feed'); }} className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-xs">Checkout</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rides' && (
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-black text-white">Dash Rides</h2>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
              <input type="text" value={ridePickup} onChange={e => setRidePickup(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="Pickup" />
              <input type="text" value={rideDropoff} onChange={e => setRideDropoff(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="Dropoff" />
              <button onClick={() => { setActiveRide({ pickup: ridePickup, dropoff: rideDropoff }); alert('Ride requested!'); }} className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-xs">Request Ride</button>
            </div>
          </div>
        )}

        {activeTab === 'git' && (
          <div className="max-w-lg mx-auto space-y-4">
            <h2 className="text-xl font-black text-white">Git Push & Deploy</h2>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <input
                type="text"
                value={gitCommitMessage}
                onChange={e => setGitCommitMessage(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
              />
              <button
                onClick={executeGitPush}
                disabled={isPushing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs transition disabled:opacity-50"
              >
                {isPushing ? 'Pushing...' : `🚀 git push origin main (${gitCommitCount} commits)`}
              </button>
              {pushSuccess && <div className="text-emerald-400 text-xs font-bold text-center">✨ Deployed successfully!</div>}
            </div>
          </div>
        )}
      </main>

      {/* ITEM MODAL */}
      {itemModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-black text-base text-white">{itemModal.name}</h3>
            <p className="text-xs text-neutral-400">{itemModal.desc}</p>
            <p className="font-black text-sm text-red-500">{itemModal.price} ETB</p>
            <div className="flex space-x-2">
              <button onClick={() => setItemModal(null)} className="flex-1 py-2.5 bg-neutral-800 rounded-xl text-xs font-bold text-neutral-300">Cancel</button>
              <button onClick={() => addToCart(itemModal, selectedStore)} className="flex-1 py-2.5 bg-red-600 rounded-xl text-xs font-bold text-white">Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}