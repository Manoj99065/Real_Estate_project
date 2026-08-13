


// src/pages/admin/AdminPurchaseRequests.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { HiShoppingCart, HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminPurchaseRequests = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const fetchPending = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/purchase/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Mark this deal as done?')) return;
    setProcessing(id);
    try {
      await axios.put(`${API_URL}/api/purchase/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(prev => prev.filter(r => r._id !== id));
      alert('✅ Request approved – property marked as sold.');
    } catch (err) {
      alert('Failed to approve.');
    } finally {
      setProcessing(null);
    }
  };

  const handleDecline = async (id) => {
    if (!window.confirm('Decline this request?')) return;
    setProcessing(id);
    try {
      await axios.put(`${API_URL}/api/purchase/admin/decline/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(prev => prev.filter(r => r._id !== id));
      alert('❌ Request declined.');
    } catch (err) {
      alert('Failed to decline.');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="loader"></div></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <HiShoppingCart size={28} className="text-emerald-600" />
        <h1 className="text-2xl font-bold text-gray-800">Purchase Requests</h1>
        <span className="ml-auto bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
          {requests.length} pending
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <HiClock size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No pending requests 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{req.property?.title || 'Property'}</h3>
                  <p className="text-sm text-gray-500">₹{req.property?.price?.toLocaleString()}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <HiClock size={14} /> Pending
                </span>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p><span className="font-medium">Buyer:</span> {req.buyer?.name} <span className="text-gray-400 text-xs">({req.buyer?.email})</span></p>
                <p><span className="font-medium">Seller:</span> {req.seller?.name}</p>
                {req.message && <p className="text-gray-600 italic">“{req.message}”</p>}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleApprove(req._id)}
                  disabled={processing === req._id}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <HiCheckCircle size={18} /> Deal Done
                </button>
                <button
                  onClick={() => handleDecline(req._id)}
                  disabled={processing === req._id}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <HiXCircle size={18} /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPurchaseRequests;