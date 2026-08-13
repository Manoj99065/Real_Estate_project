import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { profileStyles as s } from "../../assets/dummyStyles";
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiCheck,
  HiX,
  HiArrowLeft,
} from 'react-icons/hi';

const Profile = () => {
  const { user, setUser, token } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeProfilePic, setRemoveProfilePic] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveProfilePic(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('address', formData.address);

      if (imageFile) {
        data.append('profilePic', imageFile);
      }
      if (removeProfilePic) {
        data.append('removeProfilePic', 'true');
      }

      const res = await axios.put(`${API_URL}/api/user/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        setImageFile(null);
        setImagePreview(null);
        setRemoveProfilePic(false);
      } else {
        throw new Error(res.data.message || 'Update failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(null);
    setImageFile(null);
    setRemoveProfilePic(false);
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    setError(null);
  };

  const displayPic = imagePreview || (!removeProfilePic && user?.profilePic);

  // Determine dashboard path based on user role
  const getDashboardPath = () => {
    if (user?.role === 'seller') return '/dashboard';
    if (user?.role === 'admin') return '/admin-dashboard';
    return '/';
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      style={{ paddingTop: '6rem', paddingBottom: '4rem' }}
    >
      {/* Card Container */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to={getDashboardPath()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition font-medium text-sm"
          >
            <HiArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Personal Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal information and account settings.
          </p>
        </header>

        {/* Profile Card */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-emerald-50 overflow-hidden flex items-center justify-center mx-auto border-4 border-emerald-100">
              {displayPic ? (
                <img src={displayPic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-emerald-600">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>

            {/* Edit Actions - Only when editing */}
            {isEditing && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                <label className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-emerald-700 transition">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <HiOutlineUser size={16} />
                </label>
                {(imagePreview || (!removeProfilePic && user?.profilePic)) && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                      setRemoveProfilePic(true);
                    }}
                    className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition"
                    title="Remove Profile Picture"
                  >
                    <HiX size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-4">{user?.name}</h2>
          <span className="inline-block px-4 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase mt-1">
            {user?.role?.toUpperCase()}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Edit Form or Info Display */}
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength="10"
                pattern="\d*"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                placeholder="Enter your 10 digit number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition resize-none"
                placeholder="Enter your full address"
                rows="3"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
              >
                <HiCheck size={20} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
              >
                <HiX size={20} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <HiOutlineMail size={22} />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email Address</div>
                <div className="font-semibold text-gray-800">{user?.email}</div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <HiOutlinePhone size={22} />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone Number</div>
                <div className="font-semibold text-gray-800">{user?.phone || 'Not Provided'}</div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <HiOutlineLocationMarker size={22} />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Location / Address</div>
                <div className="font-semibold text-gray-800">{user?.address || 'Not Provided'}</div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition"
              >
                Edit Profile Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;