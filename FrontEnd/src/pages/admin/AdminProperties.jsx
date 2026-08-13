import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HiOutlineExternalLink, HiOutlineTrash } from 'react-icons/hi';
import { adminPropertiesStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/common/PropertyCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/properties`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const props = Array.isArray(res.data)
          ? res.data
          : res.data.properties || [];
        setProperties(props);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load properties: ', err);
        setLoading(false);
      }
    };

    if (token) {
      fetchProperties();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action is permanent.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/admin/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(properties.filter((p) => p._id !== id));
      alert('Property deleted successfully.');
    } catch (err) {
      alert('Failed to delete property.');
    }
  };

  if (loading) {
    return (
      <div className={s.loaderFullPage}>
        <div className={s.loader}></div>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.headerContainer}>
        <h1 className={s.pageTitle}>Property Moderation</h1>
        <p className={s.pageSubtitle}>
          Review and manage all property listings across the platform.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className={s.emptyStateCard}>
          No properties pending moderation.
        </div>
      ) : (
        // ✅ FIX: Use `items-stretch` and `auto-rows-fr` for equal heights
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr items-stretch">
          {properties.map((p) => (
            // ✅ Each card wrapper takes full height
            <div key={p._id} className="h-full flex flex-col">
              <PropertyCard
                property={p}
                renderActions={() => (
                  <div className={s.actionWrapper}>
                    <div className={s.sellerInfo}>
                      <div className={s.sellerName}>
                        Seller: {p.seller?.name || 'Unknown'}
                      </div>
                      <div className={s.sellerEmail}>{p.seller?.email}</div>
                    </div>
                    <div className={s.buttonGroup}>
                      <Link to={`/property/${p._id}`} className={s.viewLink}>
                        <HiOutlineExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className={s.deleteButton}
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </div>
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProperties;