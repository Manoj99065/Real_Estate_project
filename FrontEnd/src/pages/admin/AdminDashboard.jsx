












import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  HiOutlineUserGroup,
  HiOutlineLibrary,
  HiOutlineTicket,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    activeListings: 0,
    soldProperties: 0,
  });

  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);


  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: HiOutlineUserGroup,
      color: "#0d9488",
      bg: "#ccfbf1",
    },
    {
      title: "Total Properties",
      value: stats.totalProperties || 0,
      icon: HiOutlineLibrary,
      color: "#f59e0b",
      bg: "#fef3c7",
    },
    {
      title: "Active Listings",
      value: stats.activeListings || 0,
      icon: HiOutlineTicket,
      color: "#3b82f6",
      bg: "#dbeafe",
    },
    {
      title: "Sold Properties",
      value: stats.soldProperties || 0,
      icon: HiOutlineCheckCircle,
      color: "#10b981",
      bg: "#dcfce7",
    },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token, API_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // ✅ Proper container – full width, centered, with padding
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">

      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Admin Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, administrator. Here's today's summary</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-50 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* ✅ Stats Grid – 4 responsive cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: card.bg, color: card.color }}
            >
              <card.icon size={24} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{card.title}</div>
              <div className="text-2xl font-extrabold text-gray-800 mt-1">
                {card.value.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Second Grid – System Health + Admin Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* System Health */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            System Health
          </h3>
          <div className="space-y-4">
            {["Database", "Media Storage", "Auth Service", "API Gateway"].map((service, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                <span className="text-sm font-medium text-gray-700">{service}</span>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-green-600">Online</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Tools */}
        <div className="bg-primary p-6 rounded-2xl text-white shadow-sm">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-white/60 rounded-full"></span>
            Admin Tools
          </h3>
          <p className="text-sm opacity-90 mb-6">
            Quickly manage platform resources and tasks.
          </p>
          <div className="flex flex-col gap-3">
            <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition flex items-center gap-2 justify-start">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              System Logs
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition flex items-center gap-2 justify-start">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              DB Backup
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;