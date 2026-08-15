"use client";

import { useState } from "react";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [userName, setUserName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.j@dashndine.com");
  const [pushNotifications, setPushNotifications] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-zinc-900 border border-zinc-800 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg text-white">
              AJ
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Account Settings</h2>
              <p className="text-xs text-zinc-400">Dash & Dine VIP Member</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg">✕</button>
        </div>

        {/* Profile Settings */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Display Name</label>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
            <div>
              <p className="text-sm font-semibold">Push Notifications</p>
              <p className="text-xs text-zinc-400">Get instant order & delivery updates</p>
            </div>
            <button 
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`w-12 h-6 rounded-full p-1 transition ${pushNotifications ? "bg-red-600" : "bg-zinc-800"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition transform ${pushNotifications ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-zinc-800 space-y-2">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}