import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineAnnotation,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SellerInquiries = () => {
  const { user, token } = useAuth();

  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Fetch seller inquiries
  useEffect(() => {
    const fetchSellerInquiries = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/inquiry/seller`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setInquiries(res.data.inquiries || res.data || []);
        } else {
          setInquiries(res.data.inquiries || []);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to load seller inquiries:', err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchSellerInquiries();
  }, [token]);

  // Mark inquiry as read
  const markAsRead = async (inquiryId) => {
    try {
      await axios.patch(
        `${API_URL}/api/inquiry/${inquiryId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInquiries(
        inquiries.map((inq) =>
          inq._id === inquiryId ? { ...inq, status: 'read' } : inq
        )
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (filter === 'all') return true;
    if (filter === 'new') return inq.status !== 'read';
    if (filter === 'read') return inq.status === 'read';
    return true;
  });

  const newCount = inquiries.filter((inq) => inq.status !== 'read').length;

  // ----- Approval Pending Component -----
  const ApprovalPending = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-[100px] h-[100px] rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-8 shadow-[0_8px_16px_rgba(217,119,6,0.1)] animate-pulse">
        <HiOutlineShieldCheck size={48} />
      </div>
      <h1 className="text-[2rem] font-extrabold text-gray-800 mb-4">
        Approval Pending
      </h1>
      <p className="max-w-[500px] text-gray-500 text-[1.1rem] leading-relaxed mb-10">
        Hello {user?.name || 'User'}, your seller account is currently under review by our administration team. Approval usually takes less than 24 hours. You'll gain full dashboard access once verified.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/properties"
          className="py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-bold no-underline flex items-center gap-2 shadow-[0_4px_12px_rgba(13,110,89,0.2)] transition-all duration-300 hover:bg-emerald-700"
        >
          <HiOutlineHome size={20} />
          Browse Properties
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="py-3.5 px-6 rounded-xl bg-indigo-50 border border-indigo-200 text-emerald-700 font-bold flex items-center gap-2 transition-all duration-300 hover:bg-indigo-100 cursor-pointer"
        >
          <HiOutlineRefresh size={20} />
          Check Status Now
        </button>
      </div>
      <div className="mt-16 flex items-center gap-2 text-gray-400 text-[0.9rem]">
        Need help?{' '}
        <Link to="/contact" className="text-emerald-600 no-underline font-semibold hover:underline">
          Contact Support
        </Link>
      </div>
    </div>
  );

  // ----- Customer Inquiries Component -----
  const CustomerInquiries = () => (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Customer Inquiries
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review and respond to interest in your properties
        </p>
      </div>

      {/* Filter Tabs */}
      {inquiries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'new'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            New ({newCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'read'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Read ({inquiries.length - newCount})
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100 max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <HiOutlineAnnotation size={40} className="text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No inquiries received
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            You haven't received any inquiries yet. Better listings get more attention!
          </p>
          <Link
            to="/my-properties"
            className="inline-block mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
          >
            Improve My Listings
          </Link>
        </div>
      ) : (
        // Inquiries List
        <div className="space-y-4">
          {filteredInquiries.map((inq) => (
            <div
              key={inq._id}
              className={`bg-white rounded-xl shadow-sm border p-4 md:p-6 transition hover:shadow-md ${
                inq.status !== 'read' ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left - Property Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <HiOutlineHome size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {inq.property?.title || 'Unknown Property'}
                      </h3>
                      {inq.property && (
                        <Link
                          to={`/property/${inq.property._id}`}
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          View Property →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Buyer Details */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <HiOutlineUser size={14} /> Buyer
                      </p>
                      <p className="font-medium text-gray-800">{inq.buyer?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <HiOutlineMail size={14} /> {inq.buyer?.email || 'No email'}
                      </p>
                      {inq.buyer?.phone && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <HiOutlinePhone size={14} /> {inq.buyer.phone}
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <HiOutlineCalendar size={14} /> Received
                      </p>
                      <p className="font-medium text-gray-800">
                        {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(inq.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-sm text-gray-600 italic">"{inq.message}"</p>
                  </div>
                </div>

                {/* Right - Actions */}
                <div className="flex flex-col items-end gap-3 min-w-[120px]">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inq.status === 'read'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-emerald-100 text-emerald-700 animate-pulse'
                    }`}
                  >
                    {inq.status === 'read' ? 'Read' : 'New'}
                  </span>

                  {inq.status !== 'read' && (
                    <button
                      onClick={() => markAsRead(inq._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition"
                    >
                      <HiOutlineCheckCircle size={16} />
                      Mark as Read
                    </button>
                  )}

                  {inq.buyer?._id && (
                    <Link
                      to={`/messages?userId=${inq.buyer._id}`}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm rounded-lg transition"
                    >
                      <HiOutlineAnnotation size={16} />
                      Reply
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <h3>Error loading inquiries</h3>
        <p>{error}</p>
        <button
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // ✅ Show Approval Pending (matches screenshot)
  return <ApprovalPending />;
};

export default SellerInquiries;