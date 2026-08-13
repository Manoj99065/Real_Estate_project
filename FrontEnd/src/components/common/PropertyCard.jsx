

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { Link, useNavigate } from "react-router-dom";
import {
  HiArrowsExpand,
  HiEye,
  HiHeart,
  HiLocationMarker,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineUserGroup,
  HiShieldCheck,
} from "react-icons/hi";

const PropertyCard = ({ property, renderActions, isWishlisted, onToggleWishlist }) => {
  if (!property) return null;

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    if (onToggleWishlist) {
      onToggleWishlist(property._id);
    }
  };

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(property.price);

  // ---- Inline SVG fallback (no external request) ----
  // const fallbackImage =
  //   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%2364758b' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

  // const fallbackImage = "/default-property.jpg";
  // // ---- Extract image URL safely ----
  // const getImageSrc = () => {
  //   const first = property.images?.[0];
  //   if (!first) return fallbackImage;

  //   if (typeof first === "string") {
  //     // If relative path, prepend backend base URL
  //     if (first.startsWith("/")) {
  //       return `http://localhost:5000${first}`;
  //     }
  //     return first;
  //   }

  //   // If it's an object, try common fields
  //   let url = first.url || first.secure_url || first.path;
  //   if (url) {
  //     if (typeof url === "string" && url.startsWith("/")) {
  //       return `http://localhost:5000${url}`;
  //     }
  //     return url;
  //   }

  //   return fallbackImage;
  // };

  const fallbackImage = "/default-property.jpg";

// ---- Static images from Pexels ----
const staticImages = [
  // "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  // "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=600",
  // "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600",
  // "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600",
  // "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600",
  // "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600",

  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600",

  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600",
  "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",

  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600",

  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
  "https://images.unsplash.com/photo-1584132967330-5f5b4d0f4b5d?w=600",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600"

];

// ---- Get a consistent image per property (based on _id) ----
const getImageSrc = () => {
  const id = property._id || Math.random().toString();
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % staticImages.length;
  }
  hash = Math.abs(hash);
  return staticImages[hash];
};

  const [imgSrc, setImgSrc] = useState(getImageSrc());

  const handleImageError = () => {
    setImgSrc(fallbackImage);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
      {/* <Link to={`/property/${property._id}`} className="block"> */}
      <Link
    to={`/property/${property._id}`}
    state={{ coverImage: imgSrc }}   // 👈 pass the image being displayed
    className="block"
     >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={imgSrc}
            alt={typeof property.title === "string" ? property.title : "Property"}
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
            onError={handleImageError}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              New
            </span>
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wide">
              <HiShieldCheck size={14} /> Verified
            </span>
          </div>

          {/* Wishlist button */}
          {/* {(!user || user.role === "buyer") && ( */}
          {(!user || ["buyer", "seller", "admin"].includes(user.role)) && (
            <button
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
              onClick={handleWishlistClick}
            >
              {isWishlisted ? (
                <HiHeart size={20} fill="#ef4444" color="#ef4444" />
              ) : (
                <HiOutlineHeart size={20} />
              )}
            </button>
          )}

          {/* Price overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white text-2xl font-bold">{formattedPrice}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {property.propertyType}
            </span>
            {property.views !== undefined && (
              <div className="flex items-center text-gray-400 text-xs">
                <HiEye size={14} className="mr-1" /> {property.views}
              </div>
            )}
          </div>

          <h4 className="font-bold text-lg mt-1 leading-tight truncate">
            {property.title}
          </h4>

          <div className="flex items-center text-gray-500 text-sm mt-1">
            <HiLocationMarker className="mr-1 flex-shrink-0" />
            <span className="truncate">{property.area}, {property.city}</span>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-200">
            {property.propertyType?.toLowerCase() === "commercial" ? (
              <>
                <div className="text-center">
                  <HiOutlineHome className="mx-auto text-gray-400" size={18} />
                  <div className="text-[10px] text-gray-400 uppercase mt-1">Type</div>
                  <div className="text-sm font-semibold">{property.status}</div>
                </div>
                <div className="text-center">
                  <HiArrowsExpand className="mx-auto text-gray-400" size={18} />
                  <div className="text-[10px] text-gray-400 uppercase mt-1">Sq Ft</div>
                  <div className="text-sm font-semibold">{property.areaSize}</div>
                </div>
                <div className="text-center">
                  <HiShieldCheck className="mx-auto text-gray-400" size={18} />
                  <div className="text-[10px] text-gray-400 uppercase mt-1">Legal</div>
                  <div className="text-sm font-semibold">OK</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <HiOutlineHome className="mx-auto text-gray-400" size={18} />
                  <div className="text-[10px] text-gray-400 uppercase mt-1">Beds</div>
                  <div className="text-sm font-semibold">{property.bhk}</div>
                </div>
                <div className="text-center">
                  <HiOutlineUserGroup className="mx-auto text-gray-400" size={18} />
                  <div className="text-[10px] text-gray-400 uppercase mt-1">Baths</div>
                  <div className="text-sm font-semibold">
                    {/* {property.bathrooms || Math.max(1, parseInt(property.bhk) - 1 || 0)} */}
                  </div>
                </div>
                <div className="text-center">
                  <HiArrowsExpand className="mx-auto text-gray-400" size={18} />
                  <div className="text-[10px] text-gray-400 uppercase mt-1">Sq Ft</div>
                  <div className="text-sm font-semibold">{property.areaSize}</div>
                </div>
              </>
            )}
          </div>

          {!renderActions && (
            <button className="w-full mt-4 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition">
              View Details
            </button>
          )}
        </div>
      </Link>

      {renderActions && (
        <div className="p-3 border-t border-gray-100">
          {renderActions(property)}
        </div>
      )}
    </div>
  );
};

export default PropertyCard;