import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  HiOutlineChatAlt2,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineUserGroup,
  HiOutlineCheck,
  HiOutlineRefresh,
  HiOutlineAnnotation,
  HiOutlineUser,
  HiOutlineMail,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminInquiries = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    solved: 0,
    sellerQueries: 0,
    buyerQueries: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [statsRes, ticketsRes] = await Promise.all([
        axios.get(`${API_URL}/api/support/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/support/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (ticketsRes.data.success) setTickets(ticketsRes.data.tickets);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load support tickets:', err);
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleResolve = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/api/support/admin/${id}/status`,
        { status: 'Resolved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      alert('Failed to resolve inquiry.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">Error loading inquiries</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Stats cards configuration
  const statCards = [
    {
      title: 'Total Queries',
      value: stats.total,
      icon: HiOutlineChatAlt2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Active Queries',
      value: stats.active,
      icon: HiOutlineClock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Resolved Queries',
      value: stats.solved,
      icon: HiOutlineCheckCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Seller / Buyer',
      value: `${stats.sellerQueries} / ${stats.buyerQueries}`,
      icon: HiOutlineUserGroup,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HiOutlineChatAlt2 className="text-emerald-600" size={28} />
            Support Queries
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review, manage, and resolve support tickets raised by sellers and buyers.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition text-sm font-medium text-gray-700"
        >
          <HiOutlineRefresh size={18} className="text-emerald-600" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`${card.bg} rounded-full p-2.5`}>
                <card.icon size={22} className={card.color} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <HiOutlineAnnotation size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-600">No support queries</h3>
          <p className="text-gray-400 text-sm">The platform has no pending or resolved tickets.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition duration-200"
            >
              {/* Header: Subject + Status/Priority badges */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <HiOutlineAnnotation className="text-emerald-600" size={20} />
                  <h3 className="text-base font-semibold text-gray-800">
                    {ticket.subject}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      ticket.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : ticket.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {ticket.priority || 'Medium'} Priority
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      ticket.status === 'Resolved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {ticket.status === 'Resolved' ? '✅ Resolved' : '⏳ Pending'}
                  </span>
                </div>
              </div>

              {/* Body: User details + Message + Action */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {/* User Info */}
                <div className="col-span-1">
                  <div className="flex items-start gap-2">
                    <div className="bg-gray-100 rounded-full p-2">
                      <HiOutlineUser className="text-gray-500" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {ticket.user?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <HiOutlineMail size={12} /> {ticket.user?.email}
                      </p>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">
                        Role: {ticket.userType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="col-span-1 md:col-span-1">
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                    "{ticket.message}"
                  </p>
                </div>

                {/* Action */}
                <div className="col-span-1 flex items-start justify-end">
                  {ticket.status !== 'Resolved' ? (
                    <button
                      onClick={() => handleResolve(ticket._id)}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg transition shadow-sm hover:shadow"
                    >
                      <HiOutlineCheck size={18} />
                      Mark Resolved
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
                      <HiOutlineCheckCircle size={18} />
                      Completed
                    </div>
                  )}
                </div>
              </div>

              {/* Created date */}
              <div className="text-xs text-gray-400 mt-3 border-t border-gray-100 pt-2">
                Created: {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;