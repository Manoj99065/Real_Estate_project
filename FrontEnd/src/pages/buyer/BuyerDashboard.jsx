import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineHome, HiOutlineCheckCircle, HiOutlineClock,
  HiOutlineChatAlt2, HiOutlineMail, HiOutlinePhone,
  HiOutlineCheck, HiOutlineShoppingBag, HiArrowLeft
} from 'react-icons/hi';

const BuyerDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState({ totalBought: 0, approved: 0, pending: 0 });
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSuccess, setSupportSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/purchase/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allRequests = res.data.requests || [];
        const activeRequests = allRequests.filter(r => r.status !== 'declined');
        setPurchases(activeRequests);

        const total = activeRequests.length;
        const approved = activeRequests.filter(r => r.status === 'approved').length;
        const pending = activeRequests.filter(r => r.status === 'pending').length;
        setStats({ totalBought: total, approved, pending });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching purchase requests:', err);
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/properties');
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   await axios.post(`${API_URL}/api/buyer/support-request`,
    //     { message: supportMessage },
    //     { headers: { Authorization: `Bearer ${token}` } }
      // );
      try {
        await axios.post(`${API_URL}/api/support/create`,
          {
            subject: "Support Request",  // backend mein subject bhi chahiye
            message: supportMessage,
            priority: "Medium"           // optional, default 'medium' hai
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      setSupportSuccess("✅ Your urgent message has been sent to the Admin!");
      setSupportMessage('');
      setTimeout(() => setSupportSuccess(''), 4000);
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      {/* Header with Back Button */}
      <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name || 'Buyer'}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your real estate journey and manage your purchased properties.
          </p>
        </div>
        <button
          onClick={goBack}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-5 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <HiArrowLeft size={20} /> Back
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center gap-5 hover:shadow-lg transition">
          <div className="p-4 bg-emerald-100 rounded-xl">
            <HiOutlineHome size={28} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-800">{stats.totalBought}</div>
            <div className="text-sm font-medium text-gray-500">Total Bought</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center gap-5 hover:shadow-lg transition">
          <div className="p-4 bg-blue-100 rounded-xl">
            <HiOutlineCheckCircle size={28} className="text-blue-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-600">{stats.approved}</div>
            <div className="text-sm font-medium text-gray-500">Approved</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center gap-5 hover:shadow-lg transition">
          <div className="p-4 bg-yellow-100 rounded-xl">
            <HiOutlineClock size={28} className="text-yellow-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-yellow-600">{stats.pending}</div>
            <div className="text-sm font-medium text-gray-500">Pending</div>
          </div>
        </div>
      </div>

      {/* My Purchased Properties */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <HiOutlineShoppingBag className="text-emerald-600" /> My Purchased Properties
        </h2>
        {purchases.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            You haven't purchased any property yet.
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((req) => {
              const prop = req.property || {};
              return (
                <div key={req._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <img
                      src={prop.images?.[0] || 'https://via.placeholder.com/80?text=No+Image'}
                      alt={prop.title}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{prop.title || 'Unnamed'}</h4>
                      <p className="text-sm text-gray-500">{prop.area}, {prop.city}</p>
                      <p className="text-emerald-600 font-medium text-sm">
                        ₹{Number(prop.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center mt-2 sm:mt-0">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 text-[10px] font-bold rounded-full uppercase">
                      Sold
                    </span>
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                      req.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status === 'approved' ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact & Urgent Support – Horizontal split */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <HiOutlineChatAlt2 className="text-emerald-600" size={24} /> Need Help? Contact Admin
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left: Contact Info */}
          <div className="flex flex-col justify-between space-y-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="flex items-center gap-3 text-base font-semibold text-gray-800">
                <HiOutlineMail className="text-emerald-600" size={22} /> support@realestate.com
              </div>
              <div className="flex items-center gap-3 text-base font-semibold text-gray-800 mt-3">
                <HiOutlinePhone className="text-emerald-600" size={22} /> +1 (234) 567-7890
              </div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-sm text-gray-700">
              ⚠️ If your purchase is stuck or you have a dispute, use the form to notify admin.
            </div>
          </div>

          {/* Right: Urgent Message Form */}
          <form onSubmit={handleSupportSubmit} className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Urgent Message *</label>
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Describe your urgent issue here..."
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-sm resize-none h-24 transition"
              />
            </div>
            {supportSuccess && (
              <div className="text-emerald-700 bg-emerald-100 p-2 rounded-lg text-sm font-medium">
                {supportSuccess}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg flex justify-center items-center gap-2"
            >
              <HiOutlineCheck size={20} /> Send Urgent Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;