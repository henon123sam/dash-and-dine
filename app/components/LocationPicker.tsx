"use client";

import { useState } from "react";

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: { label: string; address: string; coords?: { lat: number; lng: number } }) => void;
}

export default function LocationPicker({ isOpen, onClose, onSelectLocation }: LocationPickerProps) {
  const [label, setLabel] = useState<"Home" | "Office" | "Other">("Home");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Fetch current coordinates via Browser Geolocation API
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
        setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)} (Current Location)`);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to retrieve location. Please check browser permissions.");
        setLoading(false);
      }
    );
  };

  const handleSave = () => {
    if (!address) return alert("Please enter or select a location!");
    onSelectLocation({ label, address, coords: coords || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-900">Set Delivery Address</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
        </div>

        {/* Location Tags (Home / Office / Other) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Save Location As</label>
          <div className="flex gap-2">
            {(["Home", "Office", "Other"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLabel(type)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition ${
                  label === type
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {type === "Home" ? "🏠 Home" : type === "Office" ? "💼 Office" : "📍 Other"}
              </button>
            ))}
          </div>
        </div>

        {/* Current Location Button */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-3 rounded-xl border border-red-200 transition"
        >
          <span>🎯</span>
          <span>{loading ? "Detecting location..." : "Use Current GPS Location"}</span>
        </button>

        {/* Manual Address Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Address / Street Name</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Main St, Apt 4B"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
          />
        </div>

        {/* Live Google Map Preview */}
        {coords && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Live Map Preview</label>
            <div className="h-44 w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <iframe
                title="Live Map Location"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
              ></iframe>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-600 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
          >
            Confirm Address
          </button>
        </div>
      </div>
    </div>
  );
}