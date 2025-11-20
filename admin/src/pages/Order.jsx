import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(backendUrl+'/api/orders/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      else alert(data.message || 'Failed');
    } catch (err) {
      console.error(err);
      alert('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch('http://localhost:5000/api/orders/status', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ orderId, status })
      });
      const data = await res.json();
      if (data.success) {
        alert('Updated');
        fetchOrders();
      } else {
        alert(data.message || 'Failed');
      }
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o._id} className="p-4 rounded shadow bg-none border">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{o.address?.fullName || o.userId?.name}</div>
                <div className="text-sm text-gray-600">{o.address?.email || o.userId?.email}</div>
                <div className="text-sm">Order ID: {o._id}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">Rs. {o.amount}</div>
                <div className="text-sm">{new Date(o.date).toLocaleString()}</div>
                <div className="mt-2">
                  <select value={o.status} onChange={(e)=>updateStatus(o._id, e.target.value)} className="border p-1 rounded">
                    <option>Order Placed</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm">
              <strong>Items:</strong>
              <ul className="list-disc ml-5">
                {o.items.map((it, idx) => <li key={idx}>{it.name} - Qty {it.quantity} - Rs. {it.price}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
