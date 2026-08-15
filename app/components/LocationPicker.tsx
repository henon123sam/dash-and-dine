"use client";

import { useState } from "react";

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    label: string;
    address: string;
    residenceType: "Apartment/Complex" | "House" | "Business";
    buildingName: string;
    unitNumber: string;
    gateCode: string;
    dropoffInstructions: string;
    lat: number;
    lng: number;
  }) => void;
}

export default function LocationPicker({ isOpen, onClose, onSelectLocation }: LocationPickerProps) {
  const [label, setLabel] = useState<"Home" | "Office" | "Other">("Home");
  const [residenceType, setResidenceType] = useState<"Apartment/Complex" | "House" | "Business">("Apartment/Complex");
  const [streetAddress, setStreetAddress] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [gateCode, setGateCode] = useState("");
  const [dropoffInstructions, setDropoffInstructions] = useState("");

  // Default coordinates (38.7640, -77.1534 from your location)
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 38.7640,
    lng: -77.1534,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Fetch GPS & convert raw lat/lng to readable street/neighborhood address
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        try {
          // Reverse geocode via OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          if (data && data.address) {
            const road = data.address.road || data.address.pedestrian || "";
            const houseNum = data.address.house_number || "";
            const suburb = data.address.suburb || data.address.neighbourhood || data.address.city || data.address.town || "";
            const formatted = [houseNum, road, suburb].filter(Boolean).join(", ");
            setStreetAddress(formatted || data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          } else {
            setStreetAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        } catch (err) {
          console.error("Geocoding failed", err);
          setStreetAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("GPS error", error);
        alert("GPS signal error. You can type your address manually below.");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSave = () => {
    if (!streetAddress) {
      alert("Please enter or select a street address.");
      return;
    }

    let fullFormattedAddress = streetAddress;
    if (residenceType === "Apartment/Complex") {
      if (buildingName) fullFormattedAddress = `${buildingName} - ${fullFormattedAddress}`;
      if (unitNumber) fullFormattedAddress += ` (Apt ${unitNumber})`;
    } else if (unitNumber) {
      fullFormattedAddress += ` (#${unitNumber})`;
    }

    onSelectLocation({
      label,
      address: fullFormattedAddress,
      residenceType,
      buildingName,
      unitNumber,
      gateCode,
      dropoffInstructions,
      lat: coords.lat,
      lng: coords.lng,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 text-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl">📍</span>
            <h2 className="text-xl font-bold">Delivery Address & Building Details</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg">✕</button>
        </div>

        {/* Saved As Tag */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Save Tag</label>
          <div className="flex gap-2">
            {(["Home", "Office", "Other"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setLabel(type)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                  label === type
                    ? "bg-red-600 text-white border-red-500 shadow-md"
                    : "bg-zinc-800/60 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800"
                }`}
              >
                {type === "Home" ? "🏠 Home" : type === "Office" ? "💼 Office" : "📍 Other"}
              </button>
            ))}
          </div>
        </div>

        {/* Residence / Building Type Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Property Type</label>
          <div className="flex gap-2">
            {(["Apartment/Complex", "House", "Business"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setResidenceType(type)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                  residenceType === type
                    ? "bg-zinc-100 text-black border-white shadow-md"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                }`}
              >
                {type === "Apartment/Complex" ? "🏢 Apartment / Complex" : type === "House" ? "🏡 House" : "🏢 Business"}
              </button>
            ))}
          </div>
        </div>

        {/* GPS Button */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-red-950/50 hover:bg-red-900/60 text-red-400 font-semibold py-3 rounded-xl border border-red-800/50 transition active:scale-[0.98]"
        >
          <span>🎯</span>
          <span>{loading ? "Finding exact street address..." : "Use GPS to Auto-Fill Street Address"}</span>
        </button>

        {/* Building & Unit Inputs */}
        <div className="space-y-3">
          {residenceType === "Apartment/Complex" && (
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase block mb-1">
                Apartment / Complex / Building Name
              </label>
              <input
                type="text"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                placeholder="e.g. Kingstowne Apartments, Building 4"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase block mb-1">
                Apt / Suite / Unit #
              </label>
              <input
                type="text"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                placeholder="e.g. Apt 302"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase block mb-1">
                Gate / Call Box Code
              </label>
              <input
                type="text"
                value={gateCode}
                onChange={(e) => setGateCode(e.target.value)}
                placeholder="e.g. #1234"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase block mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="e.g. 6200 Kingstowne Blvd"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase block mb-1">
              Drop-off Notes for Driver
            </label>
            <textarea
              rows={2}
              value={dropoffInstructions}
              onChange={(e) => setDropoffInstructions(e.target.value)}
              placeholder="e.g. Leave outside door near weight room entrance, call upon arrival"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>
        </div>

        {/* Live Satellite / Map View */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400 uppercase">Map Pin Confirmation</label>
          <div className="h-40 w-full rounded-xl overflow-hidden border border-zinc-800">
            <iframe
              title="Location Pin Map"
              width="100%"
              height="100%"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed`}
              className="filter contrast-[1.1] invert-[0.9] hue-rotate-180"
            ></iframe>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-zinc-400 border border-zinc-800 rounded-xl font-semibold hover:bg-zinc-800 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-500 transition shadow-lg shadow-red-950 active:scale-[0.98]"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}