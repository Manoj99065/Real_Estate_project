



import React, { useState, useEffect, useRef } from 'react';
import { propertiesStyles as s } from "../../assets/dummyStyles";
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from "react-router-dom";
import {
  HiFilter,
  HiSearch,
  HiX,
  HiViewGrid,
  HiViewList,
  HiAdjustments,
  HiMenu,
} from "react-icons/hi";
import axios from "axios";
import API_URL from "../../config";
import Navbar from "../../components/common/Navbar";
import PropertyCard from '../../components/common/PropertyCard';

// ---- Safe className helper ----
const getClassName = (style) => (typeof style === 'string' ? style : '');

const Properties = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false); // ✅ Single state for all screens

  const [filters, setFilters] = useState({
    city: "",
    propertyType: [],
    bhk: "",
    maxPrice: 100000000,
    amenities: [],
    furnishing: [],
    sort: "latest",
  });

  const propertyTypes = [
    { label: "Flat/Apartment", value: "flat" },
    { label: "Independent House/Villa", value: "villa" },
    { label: "Penthouse", value: "penthouse" },
    { label: "Commercial", value: "commercial" },
  ];
  const bhkOptions = ["1", "2", "3", "4", "5+"];
  const furnishingOptions = [
    { label: "Furnished", value: "furnished" },
    { label: "Semi-Furnished", value: "semi-furnished" },
    { label: "Unfurnished", value: "unfurnished" },
  ];

  const fetchTimer = useRef(null);

  // ---------- useEffect ----------
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get("city") || "";
    const type = queryParams.get("type") || "";
    const bhk = queryParams.get("bhk") || "";

    const initialFilters = {
      ...filters,
      city,
      propertyType: type ? [type] : [],
      bhk,
    };

    setFilters(initialFilters);
    fetchProperties(initialFilters);
    if (user) {
      fetchWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, user]);

  // ---------- Fetch Wishlist ----------
  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistedIds(
        res.data
          .filter((item) => item.property)
          .map((item) => String(item.property._id))
      );
    } catch (err) {
      console.error("failed to fetch wishlist:", err);
    }
  };

  // ---------- Toggle Wishlist ----------
  const handleToggleWishlist = async (propertyId) => {
    try {
      const isWishlisted = wishlistedIds.includes(propertyId);
      if (isWishlisted) {
        await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistedIds((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await axios.post(
          `${API_URL}/api/wishlist/${propertyId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistedIds((prev) => [...prev, propertyId]);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  // ---------- Fetch Properties ----------
  const fetchProperties = async (currentFilters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentFilters.city) params.append("city", currentFilters.city);
      if (currentFilters.propertyType.length > 0)
        params.append("propertyType", currentFilters.propertyType.join(","));
      if (currentFilters.bhk) params.append("bhk", currentFilters.bhk);
      if (currentFilters.maxPrice)
        params.append("maxPrice", currentFilters.maxPrice);
      if (currentFilters.furnishing && currentFilters.furnishing.length > 0)
        params.append("furnishing", currentFilters.furnishing.join(","));
      if (currentFilters.sort) params.append("sort", currentFilters.sort);

      const res = await axios.get(
        `${API_URL}/api/property?${params.toString()}`
      );
      setProperties(res.data.properties || []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load properties. Please try again later.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Debounced Fetch ----------
  const debouncedFetch = (updatedFilters) => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(() => {
      fetchProperties(updatedFilters);
    }, 500);
  };

  // ---------- Filter Handlers ----------
  const handleCheckboxChange = (category, value) => {
    const current = [...(filters[category] || [])];
    const index = current.indexOf(value);
    if (index === -1) {
      current.push(value);
    } else {
      current.splice(index, 1);
    }
    const updatedFilters = { ...filters, [category]: current };
    setFilters(updatedFilters);
    fetchProperties(updatedFilters);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    const updatedFilters = { ...filters, maxPrice: value };
    setFilters(updatedFilters);
    debouncedFetch(updatedFilters);
  };

  const handleBhkSelect = (value) => {
    const updatedFilters = {
      ...filters,
      bhk: filters.bhk === value ? "" : value,
    };
    setFilters(updatedFilters);
    fetchProperties(updatedFilters);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const updatedFilters = { ...filters, sort: newSort };
    setFilters(updatedFilters);
    fetchProperties(updatedFilters);
  };

  const applyFilters = () => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchProperties(filters);
    setShowFilters(false); // ✅ Filters apply karne ke baad close
  };

  const resetFilters = () => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    const reset = {
      city: "",
      propertyType: [],
      bhk: "",
      maxPrice: 100000000,
      amenities: [],
      furnishing: [],
      sort: "latest",
    };
    setFilters(reset);
    navigate("/properties");
    fetchProperties(reset);
    setShowFilters(false); // ✅ Reset ke baad close
  };

  // ✅ Filter Button Component
  const FilterToggleButton = () => (
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="fixed left-4 z-40 lg:hidden bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
      style={{ top: 'calc(80px + 1cm)' }}
      aria-label="Toggle Filters"
    >
      <HiFilter size={22} />
      {filters.city || filters.propertyType.length > 0 || filters.bhk ? (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
          !
        </span>
      ) : null}
    </button>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <Navbar />

      {/* ✅ Filter Toggle Button - Always visible on mobile */}
      <FilterToggleButton />

      <div className="flex-1 overflow-hidden pt-20 lg:pt-24 mt-[0.5cm]">
        <div className="container mx-auto px-4 lg:px-6 h-full py-4">

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">

            {/* ✅ FILTER SIDEBAR - Slide in on mobile, static on desktop */}
            <aside
              className={`
                fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0 lg:w-72 xl:w-80 lg:flex-shrink-0 lg:shadow-none
                ${showFilters ? 'translate-x-0' : '-translate-x-full'}
              `}
            >
              <div className="h-full overflow-y-auto p-4 lg:p-5">
                {/* Close button - Mobile only */}
                <div className="flex justify-between items-center mb-4 lg:hidden">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <HiFilter className="text-emerald-600" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <HiX size={22} />
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4 hidden const FilterTolg:flex">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <HiFilter className="text-emerald-600" />
                    Filters
                  </h2>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Reset
                  </button>
                </div>

                {/* ---- Filter Fields ---- */}
                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by city..."
                      value={filters.city}
                      onChange={(e) => {
                        const updatedFilters = { ...filters, city: e.target.value };
                        setFilters(updatedFilters);
                        debouncedFetch(updatedFilters);
                      }}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                    <HiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Price Range</label>
                    <span className="text-emerald-600 font-bold text-sm">
                      {filters.maxPrice >= 10000000
                        ? `₹${(filters.maxPrice / 10000000).toFixed(2)} Cr`
                        : `₹${(filters.maxPrice / 100000).toFixed(1)} L`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="100000000"
                    step="500000"
                    value={filters.maxPrice}
                    onChange={handlePriceChange}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between mt-1 text-gray-400 text-xs">
                    <span>₹1L</span>
                    <span>₹10Cr</span>
                  </div>
                </div>

                {/* Property Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <div className="space-y-1.5">
                    {propertyTypes.map((type) => (
                      <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.propertyType.includes(type.value)}
                          onChange={() => handleCheckboxChange("propertyType", type.value)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* BHK Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {bhkOptions.map((bhk) => (
                      <button
                        key={bhk}
                        className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                          filters.bhk === bhk
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-gray-300 text-gray-700 hover:border-emerald-600 hover:text-emerald-600'
                        }`}
                        onClick={() => handleBhkSelect(bhk)}
                      >
                        {bhk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Furnishing */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
                  <div className="space-y-1.5">
                    {furnishingOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.furnishing.includes(option.value)}
                          onChange={() => handleCheckboxChange("furnishing", option.value)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Filters Button */}
                <button
                  onClick={applyFilters}
                  className="w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </aside>

            {/* ✅ Overlay - When filters are open on mobile */}
            {showFilters && (
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
            )}

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto pb-4">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2 bg-white p-3 rounded-xl shadow-sm border">
                <span className="text-gray-600 text-sm">
                  Showing{" "}
                  <strong className="text-gray-800">
                    {loading ? "..." : properties.length}
                  </strong>{" "}
                  Properties
                </span>
                <div className="flex items-center gap-3">
                  {/* ✅ Filter button inside header - for desktop and mobile */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition text-sm font-medium"
                  >
                    <HiFilter size={16} />
                    Filter
                  </button>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md transition-colors ${
                        viewMode === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <HiViewGrid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md transition-colors ${
                        viewMode === "list" ? "bg-white shadow-sm text-emerald-600" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <HiViewList size={18} />
                    </button>
                  </div>
                  <select
                    value={filters.sort}
                    onChange={handleSortChange}
                    className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="latest">Latest</option>
                    <option value="priceLow">Price Low to High</option>
                    <option value="priceHigh">Price High to Low</option>
                  </select>
                </div>
              </div>

              {/* Properties Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <HiX size={48} className="mx-auto text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600">{error}</h3>
                  <button onClick={applyFilters} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg">
                    Try Again
                  </button>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12">
                  <HiAdjustments size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600">No properties found</h3>
                  <p className="text-gray-400 mt-2">Broaden your search criteria</p>
                  <button onClick={resetFilters} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg">
                    Clear All
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-4 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {properties
                    .filter((p) => p)
                    .map((p) => (
                      <PropertyCard
                        key={p._id}
                        property={p}
                        isWishlisted={wishlistedIds.includes(String(p._id))}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;