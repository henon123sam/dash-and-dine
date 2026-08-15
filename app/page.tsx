'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function CustomerMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) console.error('Error fetching menu:', error);
      else setMenu(data || []);
    }
    fetchMenu();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const totalAmount = cart.reduce(
    (sum, i) => sum + i.item.price * i.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!address) return alert('Please enter a delivery address!');
    if (cart.length === 0) return alert('Your cart is empty!');

    setLoading(true);

    const restaurantId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        restaurant_id: restaurantId,
        total_amount: totalAmount,
        delivery_address: address,
        status: 'PENDING',
      })
      .select()
      .single();

    if (orderError) {
      alert('Failed to place order: ' + orderError.message);
      setLoading(false);
      return;
    }

    const orderItems = cart.map((c) => ({
      order_id: order.id,
      menu_item_id: c.item.id,
      quantity: c.quantity,
      unit_price: c.item.price,
    }));

    await supabase.from('order_items').insert(orderItems);

    setLoading(false);
    setOrderSuccess(true);
    setCart([]);
    setAddress('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-2 text-red-600">Simple Bistro Menu</h1>
      <p className="text-gray-600 mb-6">Bole Road, Addis Ababa</p>

      {orderSuccess && (
        <div className="p-4 mb-6 bg-green-100 text-green-800 rounded-lg font-bold">
          🎉 Order placed successfully! Your food is on the way.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Items</h2>
          <div className="space-y-4">
            {menu.length === 0 ? (
              <p className="text-gray-500">Loading menu from database...</p>
            ) : (
              menu.map((item) => (
                <div
                  key={item.id}
                  className="border p-4 rounded-lg flex justify-between items-center shadow-sm bg-white"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-red-600 font-bold mt-1">{item.price} ETB</p>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold"
                  >
                    + Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border p-6 rounded-xl shadow-md h-fit bg-gray-50">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Order</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {cart.map((c) => (
                <div key={c.item.id} className="flex justify-between text-sm text-gray-800">
                  <span>
                    {c.item.name} x {c.quantity}
                  </span>
                  <span className="font-bold">
                    {c.item.price * c.quantity} ETB
                  </span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total:</span>
                <span className="text-red-600">{totalAmount} ETB</span>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Delivery Address:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bole Atlas, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm bg-white text-gray-900"
                />
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Sending Order...' : 'Place Order Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}