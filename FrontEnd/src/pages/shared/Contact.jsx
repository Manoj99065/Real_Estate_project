


import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineMail,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
} from 'react-icons/hi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
    role: user?.role || 'buyer',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Redirect sellers & admins
  if (user?.role === 'seller' || user?.role === 'admin') {
    return <Navigate to={user.role === 'seller' ? '/dashboard' : '/admin-dashboard'} replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/contact`, formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({ ...formData, message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Get in Touch
            </h1>
            <p className="text-gray-500 text-sm mt-1 max-w-2xl">
              Have questions or feedback? We'd love to hear from you. Our team is here to help.
            </p>
          </div>
          {/* 👇 Awesome Back Button */}
          <button
            onClick={goBack}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-5 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
          >
            <HiOutlineArrowLeft size={20} /> Back
          </button>
        </div>

        {/* Contact Cards – unchanged */}
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <HiOutlineMail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Email Us</h3>
                  <p className="text-gray-500 text-sm">support@realestate.com</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <HiOutlinePhone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Call Us</h3>
                  <p className="text-gray-500 text-sm">+1 (234) 567-7890</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-xl font-bold text-white mb-2">Quick Support</h3>
            <p className="text-emerald-100 text-sm max-w-lg mx-auto">
              Available <span className="font-semibold">24/7</span> for our premium members. Your satisfaction is our priority.
            </p>
          </div>
        </div>

        {/* Contact Form – unchanged */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
          {success ? (
            <div className="text-center py-8">
              <HiOutlineCheckCircle size={64} className="text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Message sent!</h2>
              <p className="text-gray-500 mb-6">
                Thank you for reaching out. We've received your message and will get back to you shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition"
              >
                Send another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <HiOutlineUser size={16} className="inline mr-1" /> Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <HiOutlineMail size={16} className="inline mr-1" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <HiOutlinePhone size={16} className="inline mr-1" /> Phone No.
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., +1 234 567 890"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <HiOutlineMail size={16} className="inline mr-1" /> Message
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition resize-none"
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;