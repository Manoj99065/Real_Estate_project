




import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { myInquiriesStyles as s } from '../../assets/dummyStyles';
import Navbar from "../../components/common/Navbar";
// Icons
import { HiOutlineChatAlt2, HiHome, HiUser, HiMail, HiCalendar, HiCheckCircle, HiExternalLink, HiChatAlt2 } from 'react-icons/hi';

// Use Vite's environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyInquiries = () => {
  const { user, token } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch inquiries
  useEffect(() => {
    const fetchInquiries = async () => {
      if (!user) return;
      try {
        const endpoint = user?.role === 'seller' ? 'seller' : 'my';
        const res = await axios.get(`${API_URL}/api/inquiry/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInquiries(res.data.inquiries || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching inquiries:', err);
        setError('Failed to load inquiries. Please try again.');
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [user, token]);

  // Mark as read (seller only)
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/api/inquiry/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInquiries(
        inquiries.map((inq) =>
          inq._id === id ? { ...inq, isRead: true } : inq
        )
      );
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  // Start chat (seller only)
  // In MyInquiries.jsx – inside the seller's message button

  const handleStartChat = async (inq) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/chat/start`,
        {
          propertyId: inq.property?._id,
          sellerId: inq.buyer?._id, // seller sends buyerId as sellerId (backend will swap)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/messages', { state: { chat: res.data } });
    } catch (err) {
      console.error('Error starting chat:', err);
      alert('Failed to start chat. Please try again.');
    }
  };

  if (error) {
    return (
      <div className={user?.role !== 'seller' ? s.bgBgAltMinH : s.bgTransparentMinH}>
        {user?.role !== 'seller' && <Navbar />}
        <div className={s.containerPy12TextCenter}>
          <div className={s.cardPremiumPy16Px8}>
            <h2 className={s.textDangerMb4}>Error</h2>
            <p className={s.mb8}>{error}</p>
            <button onClick={() => window.location.reload()} className={s.btnPrimary}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSeller = user?.role === 'seller';

  return (
    <div className={user?.role !== 'seller' ? s.bgTransparentAuto : ''}>
      {user?.role !== 'seller' && <Navbar />}

      <div
        className={`${s.containerFadeIn} ${
          user?.role !== 'seller' ? s.py12pt12 : s.pt0
        }`}
      >
        <div className={s.mb12}>
          <h1 className={s.heading}>{isSeller ? 'Customer Inquiries' : 'My Inquiries'}</h1>
          <p className={s.textMuted}>
            {isSeller
              ? 'Review and respond to interest in your properties'
              : 'Track the status of your property inquiries.'}
          </p>
        </div>

        {inquiries.length === 0 ? (
          <div className={s.cardPremiumPy24x8TextCenter}>
            <div className={s.iconContainer}>
              <HiOutlineChatAlt2 size={40} />
            </div>
            <h2 className={s.mb4}>
              No inquiries {isSeller ? 'received' : 'sent'}
            </h2>
            <p className={s.textMutedMb8}>
              {isSeller
                ? "You haven't received any inquiries yet. Better listings get more attention!"
                : "You haven't contacted any sellers yet. Interested in a property? Send an inquiry!"}
            </p>
            <Link to="/" className={s.btnPrimary}>
              {isSeller ? 'Improve My Listings' : 'Discover Properties'}
            </Link>
          </div>
        ) : (
          <div className={s.flexColGap6}>
            {inquiries.map((inq) => (
              <div key={inq._id} className={s.inquiryCard}>
                <div className={s.inquiryMain}>
                  <div className={s.iconWrapper}>
                    <HiHome className={s.iconSize} />
                  </div>
                  <div className={s.flex1}>
                    <div className={s.titleRow}>
                      <h3 className={s.titleText}>{inq.property?.title}</h3>
                      <span
                        className={`${s.badge} ${
                          inq.isRead ? s.badgeRead : s.badgeNew
                        }`}
                      >
                        {inq.isRead ? 'Read' : 'New'}
                      </span>
                    </div>
                    {isSeller && (
                      <div className={s.buyerInfo}>
                        <div className={s.infoItem}>
                          <HiUser className={s.textMutedSmall} />{' '}
                          <span className={s.fontSemibold}>
                            {inq.buyer?.name || 'Unknown'}
                          </span>
                        </div>
                        <div className={s.infoItem}>
                          <HiMail className={s.textMutedSmall} />{' '}
                          {inq.buyer?.email || 'No email'}
                        </div>
                        <div className={s.infoItem}>
                          <HiMail className={s.textMutedSmall} />{' '}
                          {inq.buyer?.phone || 'No phone provided'}
                        </div>
                      </div>
                    )}
                    <p className={s.message}>"{inq.message}"</p>
                    <div className={s.meta}>
                      <div className={s.flexItemsCenterGap2}>
                        <HiCalendar size={16} />{' '}
                        {isSeller ? 'Received' : 'Sent'} on{' '}
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </div>
                      {!isSeller && (
                        <div className={s.flexItemsCenterGap2}>
                          <HiCheckCircle size={16} />{' '}
                          {inq.isRead ? 'Seller viewed' : 'Waiting for seller'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={s.actions}>
                  <Link
                    to={`/property/${inq.property?._id}`}
                    className={s.btnOutline}
                  >
                    View Property <HiExternalLink />
                  </Link>
                  {isSeller && !inq.isRead && (
                    <button
                      onClick={() => markAsRead(inq._id)}
                      className={s.btnPrimaryWhitespaceNowrap}
                    >
                      Mark As Read
                    </button>
                  )}
                  {isSeller && (
                    <button
                      onClick={() => handleStartChat(inq)}
                      className={s.btnMessage}
                    >
                      <HiChatAlt2 /> Message
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInquiries;