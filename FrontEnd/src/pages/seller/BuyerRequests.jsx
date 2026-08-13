import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import {
  HiShoppingCart,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiHome,
  HiUser,
  HiMail,
} from 'react-icons/hi';
import API_URL from '../../config';

const BuyerRequests = () => {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Only buyers can access
  if (user?.role !== 'buyer') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/purchase/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error('Error fetching purchase requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  // Helper: status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <HiClock size={14} /> Pending
          </span>
        );
      case 'approved':
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <HiCheckCircle size={14} /> Approved
          </span>
        );
      case 'declined':
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <HiXCircle size={14} /> Declined
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <HiShoppingCart className="text-emerald-600" size={28} />
              My Purchase Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track all your property purchase requests and their status.
            </p>
          </div>
          <Link
            to="/properties"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            <HiHome size={18} /> Browse Properties
          </Link>
        </div>

        {/* Stats Cards – quick summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Total Requests</div>
            <div className="text-2xl font-bold text-gray-800">{requests.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'approved').length}
            </div>
          </div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <HiShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No requests yet</h3>
            <p className="text-gray-400 text-sm mt-1">
              You haven't submitted any purchase requests. Start browsing properties!
            </p>
            <Link
              to="/properties"
              className="mt-6 inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Explore Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                  {/* Property Image */}
                  <div className="w-full md:w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={req.property?.images?.[0] || 'https://via.placeholder.com/150x100?text=No+Image'}
                      alt={req.property?.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x100?text=No+Image';
                      }}
                    />
                  </div>

                  {/* Request Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/property/${req.property?._id}`}
                      className="text-lg font-semibold text-gray-800 hover:text-emerald-600 truncate"
                    >
                      {req.property?.title || 'Property'}
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <HiUser size={14} /> Seller: {req.seller?.name || 'Unknown'}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        ₹{Number(req.property?.price || 0).toLocaleString()}
                      </span>
                    </div>
                    {req.message && (
                      <p className="text-sm text-gray-400 mt-1 italic">“{req.message}”</p>
                    )}
                  </div>

                  {/* Status & Admin Message */}
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(req.status)}
                    {req.adminMessage && (
                      <div
                        className={`text-xs px-3 py-1 rounded-full ${
                          req.status === 'approved'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {req.adminMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerRequests;