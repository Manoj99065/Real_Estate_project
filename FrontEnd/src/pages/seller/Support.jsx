import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';
import API_URL from '../../config';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineChat,
  HiOutlineSupport,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
} from 'react-icons/hi';

const SellerSupport = () => {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'Medium',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [myTickets, setMyTickets] = useState([]);
  const [ticketLoading, setTicketLoading] = useState(true);

  // Fetch seller's previous support tickets
  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/support/my-tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyTickets(res.data.tickets || []);
      } catch (err) {
        console.error("Failed to load previous tickets", err);
      } finally {
        setTicketLoading(false);
      }
    };
    fetchMyTickets();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setSuccessMsg('');
  //   setErrorMsg('');

  //   try {
  //     await axios.post(
  //       `${API_URL}/api/support`,
  //       {
  //         subject: formData.subject,
  //         message: formData.message,
  //         priority: formData.priority,
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setSuccessMsg('Your support request has been sent to the Admin team! We will get back to you shortly.');
  //     setFormData({ subject: '', message: '', priority: 'Medium' });

  //     // Refresh the ticket list
  //     const res = await axios.get(`${API_URL}/api/support/my-tickets`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setMyTickets(res.data.tickets || []);
  //   } catch (err) {
  //     setErrorMsg(err.response?.data?.message || 'Failed to send message.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    // ✅ Check karo token hai ya nahi
    if (!token) {
      setErrorMsg('You are not logged in. Please login first.');
      setLoading(false);
      return;
    }

    try {
      // ✅ POST to /api/support/create
      await axios.post(
        `${API_URL}/api/support/create`,
        {
          subject: formData.subject,
          message: formData.message,
          priority: formData.priority,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg('Your support request has been sent to the Admin team! We will get back to you shortly.');
      setFormData({ subject: '', message: '', priority: 'Medium' });

      // ✅ Refresh ticket list – GET /api/support/my-tickets
      const res = await axios.get(`${API_URL}/api/support/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyTickets(res.data.tickets || []);

    } catch (err) {
      console.error('Support error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { icon: HiOutlinePhone, title: "Call Admin", desc: "+91 98765 43210", color: "#0d6e59" },
    { icon: HiOutlineMail, title: "Email Admin", desc: "admin@realestate.com", color: "#0d6e59" },
    { icon: HiOutlineChat, title: "Live Chat Admin", desc: "Typically replies in 5 min", color: "#0d6e59" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#0d6e59] bg-opacity-10 rounded-lg">
          <HiOutlineSupport size={28} color="#0d6e59" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Support</h1>
          <p className="text-gray-500 text-sm">Need help with your properties? Reach out to the admin directly.</p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickLinks.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <item.icon size={24} color={item.color} />
            </div>
            <h3 className="font-semibold text-gray-800">{item.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Raise a Ticket Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <HiOutlineExclamationCircle size={20} color="#0d6e59" /> Report a Problem to Admin
        </h2>

        {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{successMsg}</div>}
        {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Listing not showing up on search"
              required
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d6e59] bg-gray-50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">How urgent is this?</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d6e59] bg-gray-50 text-sm"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Detailed Message *</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Explain the issue you are facing..."
              required
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d6e59] bg-gray-50 text-sm resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0d6e59] hover:bg-[#0a5646] text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm"
            >
              {loading ? 'Sending...' : 'Send to Admin'}
            </button>
          </div>
        </form>
      </div>

      {/* My Previous Tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <HiOutlineClock size={20} color="#0d6e59" /> My Support History
          </h2>
        </div>
        {ticketLoading ? (
          <p className="text-sm text-gray-400">Loading past tickets...</p>
        ) : myTickets.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">You haven't raised any support tickets yet.</p>
        ) : (
          <div className="space-y-3">
            {myTickets.map((ticket) => (
              <div key={ticket._id} className="border border-gray-100 rounded-lg p-4 flex justify-between items-center bg-gray-50">
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">{ticket.subject}</h4>
                  <p className="text-xs text-gray-500 truncate max-w-sm">{ticket.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(ticket.createdAt).toLocaleDateString()} • Priority: {ticket.priority}
                  </p>
                </div>
                <span className={`px-2 py-1 text-[10px] font-semibold rounded-full 
                  ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                    ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-200 text-gray-700'}`}>
                  {ticket.status || 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerSupport;