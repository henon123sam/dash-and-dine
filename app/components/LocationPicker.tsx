"use client";

import { useState } from "react";

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: { label: string; address: string; lat: number; lng: number }) => void;
}

export default function LocationPicker({ isOpen, onClose, onSelectLocation }: LocationPickerProps) {
  const [label, setLabel] = useState<"Home" | "Office" | "Other">("Home");
  const [addressInput, setAddressInput] = useState("");
  // Default to NYC coordinates if GPS is off
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 40.7128, lng: -74.0060 });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        setAddressInput(`${lat.toFixed(4)}, ${lng.toFixed(4)} (GPS Location)`);
        setLoading(false);
      },
      (error) => {
        console.error("GPS Error:", error);
        alert("Unable to fetch exact GPS location. Try searching your address manually below!");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput) return;
    // Slight coordinate offset simulation for custom searches
    setCoords({ lat: coords.lat + 0.005, lng: coords.lng + 0.005 });
  };

  const handleSave = () => {
    const finalAddress = addressInput || "Selected Map Location";
    onSelectLocation({ label, address: finalAddress, lat: coords.lat, lng: coords.lng });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-zinc-900 border border-zinc-800 text-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl">📍</span>
            <h2 className="text-xl font-bold tracking-wide">Set Delivery Location</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Saved As Pills */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Save Address As</label>
          <div className="flex gap-2">
            {(["Home", "Office", "Other"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLabel(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${
                  label === type
                    ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40"
                    : "bg-zinc-800/60 text-zinc-300 border-zinc-700/50 hover:bg-zinc-800"
                }`}
              >
                {type === "Home" ? "🏠 Home" : type === "Office" ? "💼 Office" : "📍 Other"}
              </button>
            ))}
          </div>
        </div>

        {/* GPS Location Button */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 font-semibold py-3 rounded-xl border border-red-800/50 transition active:scale-[0.98]"
        >
          <span>🎯</span>
          <span>{loading ? "Fine-tuning GPS Signal..." : "Use Current Precise GPS"}</span>
        </button>

        {/* Manual Address Input */}
        <form onSubmit={handleManualSearch} className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Search or Adjust Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="e.g. 742 Evergreen Terrace, Springfield"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
            <button 
              type="submit"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-700 transition"
            >
              Update Map
            </button>
          </div>
        </form>

        {/* Interactive Google Map Frame */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live Satellite / Map View</label>
            <span className="text-xs text-red-400 font-medium">Lat: {coords.lat.toFixed(3)}, Lng: {coords.lng.toFixed(3)}</span>
          </div>
          <div className="h-48 w-full rounded-xl overflow-hidden border border-zinc-800 shadow-inner relative group">
            <iframe
              title="Live Interactive Location Map"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed`}
              className="filter contrast-[1.15] invert-[0.9] hue-rotate-180"
            ></iframe>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-zinc-400 border border-zinc-800 rounded-xl font-semibold hover:bg-zinc-800 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-500 transition shadow-lg shadow-red-900/50 active:scale-[0.98]"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}