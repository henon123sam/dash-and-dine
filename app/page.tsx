import Image from "next/image";

// Mock data for food categories
const categories = [
  { name: "Pizza", icon: "🍕" },
  { name: "Burgers", icon: "🍔" },
  { name: "Sushi", icon: "🍣" },
  { name: "Tacos", icon: "🌮" },
  { name: "Asian", icon: "🍜" },
  { name: "Desserts", icon: "🍩" },
  { name: "Healthy", icon: "🥗" },
];

// Mock data for featured restaurants
const restaurants = [
  {
    id: "1",
    name: "Slice House Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    rating: 4.8,
    reviews: "200+",
    deliveryTime: "20-30 min",
    deliveryFee: "$1.99",
    category: "Pizza",
  },
  {
    id: "2",
    name: "Burger Craft",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    rating: 4.6,
    reviews: "150+",
    deliveryTime: "15-25 min",
    deliveryFee: "Free",
    category: "Burgers",
  },
  {
    id: "3",
    name: "Sakura Sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    rating: 4.9,
    reviews: "320+",
    deliveryTime: "30-40 min",
    deliveryFee: "$2.99",
    category: "Sushi",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* 1. HERO BANNER & SEARCH BAR */}
      <section className="bg-red-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Hungry? <span className="text-yellow-300">Dash and Dine</span> delivers.
          </h1>
          <p className="text-lg text-red-100">
            Order food from your favorite local restaurants in seconds.
          </p>

          {/* Search Box */}
          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto bg-white p-2 rounded-xl shadow-lg text-gray-800">
            <input
              type="text"
              placeholder="Enter your street address or cuisine..."
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none w-full"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition">
              Find Food
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        {/* 2. FOOD CATEGORY PILLS */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore Cuisines</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-200 hover:border-red-500 hover:text-red-600 font-medium text-sm shadow-sm transition whitespace-nowrap"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. FEATURED RESTAURANT CARDS */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Spots</h2>
            <span className="text-red-600 font-medium text-sm hover:underline cursor-pointer">
              See all
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800">
                    ⏱️ {restaurant.deliveryTime}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded text-green-700 font-semibold text-xs">
                      ★ {restaurant.rating}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 pt-1">
                    <span>{restaurant.category}</span>
                    <span className="font-medium text-gray-700">
                      {restaurant.deliveryFee === "Free" ? "Free Delivery" : `${restaurant.deliveryFee} Delivery`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}