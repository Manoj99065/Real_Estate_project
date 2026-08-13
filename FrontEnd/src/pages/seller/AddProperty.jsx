



import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { addPropertyStyles as s } from '../../assets/dummyStyles';
import API_URL from '../../config';
import {
  HiPlus,
  HiX,
  HiPhotograph,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
} from 'react-icons/hi';

const AddProperty = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'flat',
    status: 'sale',
    bhk: '1',
    areaSize: '',
    price: '',
    city: '',
    area: '',
    furnishing: '',
    amenities: [],
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Amenities options
  const amenitiesList = [
    'Parking',
    'Security',
    'Water Supply',
    'Power Backup',
    'Swimming Pool',
    'Gym',
    'Garden',
    'Elevator',
    'Balcony',
    'AC',
    'Central Heating',
    'Fireplace',
  ];

  // Handle text/select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle amenities checkbox
  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const current = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: current };
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  // Remove image
  const removeImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = formData.images.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setFormData((prev) => ({ ...prev, images: updatedFiles }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ✅ UPDATED: Added check for areaSize
    if (!formData.title || !formData.price || !formData.city || !formData.area || !formData.areaSize) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'images') {
          formData.images.forEach((file) => {
            formDataToSend.append('images', file);
          });
        } else if (key === 'amenities') {
          formData.amenities.forEach((item) => {
            formDataToSend.append('amenities', item);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const res = await axios.post(`${API_URL}/api/property`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success || res.data.property) {
        navigate('/dashboard');
      } else {
        setError(res.data.message || 'Failed to add property.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add property.');
    } finally {
      setLoading(false);
    }
  };  return (
    <div className={s.outerContainer}>
      <div className={s.innerContainer}>
        <div className={s.header}>
          <h1 className={s.heading}>Add New Property</h1>
          <p className={s.subheading}>List your property for sale or rent</p>
        </div>

        <form onSubmit={handleSubmit} className={s.form}>
          {error && <div className={s.error}>{error}</div>}

          {/* Section: Basic Info */}
          <div className={s.section}>
            <div className={s.sectionHeader}>
              <div className={s.sectionBar} />
              <h2 className={s.sectionTitle}>Basic Information</h2>
            </div>
            <div className={s.contentGroupLarge}>
              <div>
                <label className={s.label}>Property Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Luxury 3BHK Apartment in Whitefield"
                  value={formData.title}
                  onChange={handleChange}
                  className={s.input}
                  required
                />
              </div>
              <div>
                <label className={s.label}>Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChange={handleChange}
                  className={`${s.input} ${s.textarea}`}
                />
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className={s.section}>
            <div className={s.sectionHeader}>
              <div className={s.sectionBar} />
              <h2 className={s.sectionTitle}>Location</h2>
            </div>
            <div className={s.twoColumnGrid}>
              <div>
                <label className={s.label}>City *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Bangalore"
                  value={formData.city}
                  onChange={handleChange}
                  className={s.input}
                  required
                />
              </div>
              <div>
                <label className={s.label}>Area / Locality *</label>
                <input
                  type="text"
                  name="area"
                  placeholder="e.g. Whitefield"
                  value={formData.area}
                  onChange={handleChange}
                  className={s.input}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Property Details */}
          <div className={s.section}>
            <div className={s.sectionHeader}>
              <div className={s.sectionBar} />
              <h2 className={s.sectionTitle}>Property Details</h2>
            </div>
            <div className={s.twoColumnGrid}>
              <div>
                <label className={s.label}>Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className={`${s.input} ${s.select}`}
                >
                  <option value="flat">Flat / Apartment</option>
                  <option value="villa">Independent House / Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className={s.label}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`${s.input} ${s.select}`}
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className={s.label}>BHK</label>
                <select
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleChange}
                  className={`${s.input} ${s.select}`}
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5 BHK</option>
                  <option value="5+">5+ BHK</option>
                </select>
              </div>
              <div>
                <label className={s.label}>Area Size (sq ft) *</label>
                <input
                  type="number"
                  name="areaSize"
                  placeholder="e.g. 1200"
                  value={formData.areaSize}
                  onChange={handleChange}
                  className={s.input}
                  required
                />
              </div>
              <div>
                <label className={s.label}>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 7500000"
                  value={formData.price}
                  onChange={handleChange}
                  className={s.input}
                  required
                />
              </div>
              <div>
                <label className={s.label}>Furnishing</label>
                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                  className={`${s.input} ${s.select}`}
                >
                  <option value="">Select</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Amenities */}
          <div className={s.section}>
            <div className={s.sectionHeader}>
              <div className={s.sectionBar} />
              <h2 className={s.sectionTitle}>Amenities</h2>
            </div>
            <div className={s.amenitiesGrid}>
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity}
                  className={`${s.amenityLabelBase} ${
                    formData.amenities.includes(amenity)
                      ? s.amenityLabelActive
                      : s.amenityLabelInactive
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className={s.amenityCheckbox}
                  />
                  <span
                    className={`${s.amenityTextBase} ${
                      formData.amenities.includes(amenity)
                        ? s.amenityTextActive
                        : s.amenityTextInactive
                    }`}
                  >
                    {amenity}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Section: Images */}
          <div className={s.section}>
            <div className={s.sectionHeader}>
              <div className={s.sectionBar} />
              <h2 className={s.sectionTitle}>Images</h2>
            </div>

            <div
              className={s.uploadArea}
              onClick={() => fileInputRef.current.click()}
            >
              <div className={s.uploadIconWrapper}>
                <HiPhotograph size={48} color="#0d6e59" />
              </div>
              <h3 className={s.uploadTitle}>Click to upload images</h3>
              <p className={s.uploadSubtext}>
                Upload up to 5 images (JPG, PNG, WebP)
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className={s.previewsGrid}>
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className={s.previewItem}>
                    <img
                      src={src}
                      alt={`preview ${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className={s.removeButton}
                    >
                      <HiX size={14} />
                    </button>
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <div
                    className={s.addMoreBox}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <HiPlus size={24} color="#64748b" />
                    <span className={s.addMoreText}>Add More</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className={s.footerButtons}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className={s.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={s.submitButton}
            >
              {loading ? 'Submitting...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;