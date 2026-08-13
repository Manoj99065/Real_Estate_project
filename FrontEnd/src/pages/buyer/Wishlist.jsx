


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { wishlistStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import PropertyCard from '../../components/common/PropertyCard';
import { HiHeart, HiTrash } from 'react-icons/hi';
import API_URL from '../../config';

const Wishlist = () => {
  const { user, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Check if user is seller – redirect to dashboard
  if (user?.role === 'seller') {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Check if user is admin – redirect to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Fetch wishlist
  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load wishlist.');
      setLoading(false);
    }
  };

  // Remove property from wishlist
  const removeFromWishlist = async (propertyId) => {
    if (!propertyId) {
      alert('Invalid Property ID');
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems((prev) =>
        prev.filter((item) => item.property && item.property._id !== propertyId)
      );
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to remove from wishlist.';
      alert(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className={s.loaderFullPage}>
        <div className={s.loader} />
      </div>
    );
  }

  return (
    <div className={s.pageContainer}>
      <Navbar />

      <main className={s.mainContainer}>
        <div className={s.headingWrapper}>
          <h1 className={s.heading}>Your Wishlist</h1>
          <p className={s.subheading}>Properties you've saved for later.</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className={s.emptyCard}>
            <div className={s.emptyIconWrapper}>
              <HiHeart size={40} />
            </div>
            <h2 className={s.emptyTitle}>Your Wishlist is empty</h2>
            <p className={s.emptyText}>
              Start exploring properties and save your favorites!
            </p>
            <Link to="/" className={s.browseButton}>
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className={s.gridContainer}>
            {wishlistItems
              .filter((item) => item.property)
              .map((item) => (
                <PropertyCard
                  key={item._id}
                  property={item.property}
                  renderActions={() => (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWishlist(item.property._id);
                      }}
                      className={s.removeButton}
                    >
                      <HiTrash size={18} />
                      Remove From Wishlist
                    </button>
                  )}
                />
              ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
