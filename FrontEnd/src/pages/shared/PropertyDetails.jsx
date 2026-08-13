

// PropertyDetails.jsx – final with only Chat and Buy Property (no Interested)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { propertyDetailsStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import axios from 'axios';
import API_URL from '../../config';
import {
  HiChevronRight,
  HiChevronLeft,
  HiX,
  HiBadgeCheck,
  HiCalendar,
  HiCollection,
  HiHeart,
  HiLocationMarker,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
  HiChatAlt,
  HiShoppingCart,
} from 'react-icons/hi';
import PropertyCard from '../../components/common/PropertyCard';

// ---- Safe className helper ----
const getClassName = (style) => (typeof style === 'string' ? style : '');

// ---- Fallback image ----
const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%2364758b' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { coverImage: passedCover } = location.state || {};

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [inquiryStatus, setInquiryStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null); // 'pending', 'approved', 'declined'

  // ---------- Fetch property details ----------
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/property/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setProperty(res.data.property);
        setSimilarProperties(res.data.similarProperties || []);

        if (user && user.role === 'buyer') {
          // Check pending request
          try {
            const reqRes = await axios.get(`${API_URL}/api/purchase/check/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (reqRes.data.status) {
              setRequestStatus(reqRes.data.status);
            }
          } catch (err) {
            // ignore
          }

          // Check wishlist
          const wishRes = await axios.get(`${API_URL}/api/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const found = wishRes.data.some((item) => item.property?._id === id);
          setIsInWishlist(found);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load property details');
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, user, token]);

  // ---------- Toggle wishlist ----------
  const handleWishlistToggle = async () => {
    if (!user) return navigate('/login');
    try {
      if (isInWishlist) {
        await axios.delete(`${API_URL}/api/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsInWishlist(false);
      } else {
        await axios.post(
          `${API_URL}/api/wishlist/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(true);
      }
    } catch (err) {
      alert('Failed to update wishlist.');
    }
  };

  // ---------- Handle inquiry submit ----------
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (user.role !== 'buyer') return alert('Only buyers can send inquiries');

    setInquiryStatus({ ...inquiryStatus, loading: true });
    try {
      await axios.post(
        `${API_URL}/api/inquiry`,
        {
          propertyId: id,
          message: inquiry.message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const chatRes = await axios.post(
        `${API_URL}/api/chat/start`,
        {
          propertyId: id,
          sellerId: property.seller._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        `${API_URL}/api/chat/send`,
        {
          chatId: chatRes.data._id,
          text: `Inquiry: ${inquiry.message}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInquiryStatus({ loading: false, success: true, error: null });
      setInquiry({ ...inquiry, message: '' });
      navigate('/messages', { state: { chat: chatRes.data } });
    } catch (err) {
      setInquiryStatus({
        loading: false,
        success: false,
        error: 'Failed to send inquiry',
      });
    }
  };

  // ---------- Start chat ----------
  const handleChatStart = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'buyer')
      return alert('Only buyers can chat with sellers');
    try {
      const res = await axios.post(
        `${API_URL}/api/chat/start`,
        {
          propertyId: id,
          sellerId: property.seller._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const chat = res.data;
      await axios.post(
        `${API_URL}/api/chat/send`,
        {
          chatId: chat._id,
          text: `(Context: Interested in property "${property.title}")`,
          image: property.images[0] || '',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/chat-message', { state: { chat } });
    } catch (err) {
      console.error('Error starting chat:', err);
      alert('Failed to start chat.');
    }
  };

  // ---------- Request to Buy ----------
  const handleRequestToBuy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'buyer') {
      alert('Only buyers can request to buy');
      return;
    }
    if (requestStatus === 'pending') {
      alert('You already have a pending request for this property.');
      return;
    }
    if (property.status === 'sold') {
      alert('This property is already sold.');
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/api/purchase/request`,
        {
          propertyId: property._id,
          message: `I want to buy this property: ${property.title}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequestStatus('pending');
      alert('Purchase request sent to admin. You will be notified upon approval.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  // ---------- Lightbox helpers ----------
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () =>
    setLightboxIndex((prev) => (prev + 1) % property.images.length);
  const prevImage = () =>
    setLightboxIndex(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );

  // ---------- Loading / error states ----------
  if (loading) {
    return (
      <div className="loader-full-page">
        <div className="loader"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        {error || 'Property not found'}
      </div>
    );
  }

  // ---------- Render ----------
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.price);

  const getImageSrc = (index = 0) => {
    const img = property.images?.[index];
    if (!img) return fallbackImage;
    if (typeof img === 'string') return img;
    return fallbackImage;
  };

  return (
    <div className={getClassName(s.pageContainer)}>
      <Navbar />

      <main className={getClassName(s.mainContainer)}>
        {/* Breadcrumbs */}
        <nav className={getClassName(s.breadcrumbs)}>
          <Link to="/" className={getClassName(s.breadcrumbLink)}>Home</Link>
          <HiChevronRight />
          <Link to="/properties" className={getClassName(s.breadcrumbLink)}>Listings</Link>
          <HiChevronRight />
          <span className={getClassName(s.breadcrumbCurrent)}>{property.title}</span>
        </nav>

        {/* Gallery */}
        <div className={getClassName(s.galleryContainer)}>
          <div
            className={getClassName(s.galleryGrid)}
            style={{
              gridTemplateColumns:
                property.images.length > 1 ? 'repeat(4, 1fr)' : '1fr',
              gridTemplateRows:
                property.images.length > 1 ? 'repeat(2, 180px)' : '400px',
            }}
          >
            <div
              className={getClassName(s.galleryMainItem)}
              onClick={() => openLightbox(0)}
            >
              <img
                src={passedCover || getImageSrc(0)}
                alt="property"
                className={getClassName(s.galleryImage)}
                onError={(e) => { e.target.src = fallbackImage; }}
              />
            </div>
            {property.images.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className={getClassName(s.gallerySideItem)}
                onClick={() => openLightbox(idx + 1)}
              >
                <img
                  src={getImageSrc(idx + 1)}
                  alt="property"
                  className={getClassName(s.galleryImage)}
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
                {idx === 3 && property.images.length > 5 && (
                  <div className={getClassName(s.galleryMoreOverlay)}>
                    +{property.images.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile slider */}
          <div className={getClassName(s.mobileSliderContainer)}>
            <div className={getClassName(s.mobileSliderTrack)}>
              {property.images.map((img, idx) => (
                <div
                  key={idx}
                  className={getClassName(s.mobileSlide)}
                  onClick={() => openLightbox(idx)}
                >
                  <img
                    src={getImageSrc(idx)}
                    alt="images"
                    className={getClassName(s.mobileSlideImage)}
                    onError={(e) => { e.target.src = fallbackImage; }}
                  />
                  <div className={getClassName(s.mobileSlideCounter)}>
                    {idx + 1} / {property.images.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <div className={getClassName(s.lightboxOverlay)} onClick={closeLightbox}>
            <button onClick={closeLightbox} className={getClassName(s.lightboxCloseBtn)}>
              <HiX size={24} className={getClassName(s.lightboxCloseIcon)} />
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className={getClassName(s.lightboxContent)}
            >
              <img
                src={getImageSrc(lightboxIndex)}
                alt="property"
                className={getClassName(s.lightboxImage)}
                onError={(e) => { e.target.src = fallbackImage; }}
              />
              {property.images.length > 1 && (
                <>
                  <button onClick={prevImage} className={getClassName(s.lightboxPrevBtn)}>
                    <HiChevronLeft size={30} />
                  </button>
                  <button onClick={nextImage} className={getClassName(s.lightboxNextBtn)}>
                    <HiChevronRight size={30} />
                  </button>
                </>
              )}
              <div className={getClassName(s.lightboxCounter)}>
                {lightboxIndex + 1} / {property.images.length}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className={getClassName(s.detailsLayout)}>
          <div className={getClassName(s.infoColumn)}>
            <div className={getClassName(s.infoHeader)}>
              <div className={getClassName(s.titlewrapper)}>
                <div className={getClassName(s.badgewrapper)}>
                  <span className={getClassName(s.premiumBadge)}>Premium Listing</span>
                </div>
                <h1 className={getClassName(s.propertyTitle)}>{property.title}</h1>
                <p className={getClassName(s.propertyLoaction)}>
                  <HiLocationMarker className={getClassName(s.locatoinIcon)} />
                  <span className={getClassName(s.loactionText)}>
                    {property.area}, {property.city}, India
                  </span>
                </p>
              </div>
              <div className={getClassName(s.actionButton)}>
                {(!user || user.role === "buyer") && (
                  <button
                    onClick={handleWishlistToggle}
                    className={getClassName(s.wishlistButton(isInWishlist))}
                  >
                    {isInWishlist ? (
                      <HiHeart size={26} fill="#ef4444" />
                    ) : (
                      <HiOutlineHeart size={26} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className={getClassName(s.statsGrid)}>
              {[
                { label: "Bedrooms", value: property.bhk || 0, icon: HiOutlineHome },
                { label: "Bathrooms", value: property.bathrooms || Math.max(1, (parseInt(property.bhk) || 1) - 1), icon: HiOutlineUserGroup },
                { label: "Furnishing", value: property.furnishing || "N/A", icon: HiCollection },
                { label: "Living Area", value: `${property.areaSize} sqft`, icon: HiOutlineViewGrid },
                { label: "Type", value: property.propertyType, icon: HiCalendar },
              ].map((stat, i) => (
                <div key={i} className={getClassName(s.statCard)}>
                  {stat.icon && <stat.icon size={18} className={getClassName(s.statIcon)} />}
                  <div className={getClassName(s.statValue)}>{stat.value}</div>
                  <div className={getClassName(s.statLabel)}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className={getClassName(s.descriptionSection)}>
              <h3 className={getClassName(s.sectionTitle)}>Description</h3>
              <p className={getClassName(s.descriptiontext)}>
                {property.description || "No description available for this property."}
              </p>
            </div>

            <div className={getClassName(s.amenitiesSection)}>
              <h3 className={getClassName(s.sectionTitle)}>Amenities</h3>
              <div className={getClassName(s.amentitiesGrid)}>
                {(property.amenities?.length
                  ? property.amenities
                  : ["Parking", "Security", "Water Supply", "Power Backup"]
                ).map((amn, i) => (
                  <div key={i} className={getClassName(s.amenityItem)}>
                    <HiBadgeCheck size={18} className={getClassName(s.amenityIcon)} />
                    <span className={getClassName(s.amenityText)}>{amn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={getClassName(s.sidevarColumn)}>
            <div className={getClassName(s.priceCard)} style={{ background: "var(--primary)" }}>
              <div className={getClassName(s.priceCardValue)}>
                {property.status?.toLowerCase() === "rent"
                  ? `₹${Number(property.price).toLocaleString("en-IN")}`
                  : formattedPrice}
              </div>
              {property.status?.toLowerCase() === "rent" && (
                <span className={getClassName(s.priceCardPeriod)}> /month</span>
              )}
            </div>

            {property.status?.toLowerCase() === "rent" && (
              <div className={getClassName(s.rentDetails)}>
                <div className={getClassName(s.rentDetailRow)}>
                  <span className={getClassName(s.rentDetailLabel)}>Security Deposit</span>
                  <span className={getClassName(s.rentDetailValue)}>
                    ₹ {Number(property.securityDeposit || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className={getClassName(s.rentDetailRow)}>
                  <span className={getClassName(s.rentDetailLabel)}>Maintenance</span>
                  <span className={getClassName(s.rentDetailValue)}>
                    ₹ {Number(property.maintenance || 0).toLocaleString("en-IN")} /mo
                  </span>
                </div>
              </div>
            )}

            <div className={getClassName(s.priceCardAvailability)}>
              Available for{" "}
              {property.status?.toLowerCase() === "rent" ? "Rent" : "Sale"}
            </div>
          </div>

          {/* Seller & Contact */}
          <div className={getClassName(s.sellerCard)}>
            <div className={getClassName(s.sellerInfo)}>
              <div className={getClassName(s.sellerAvatar)}>
                <img
                  src={
                    property.seller?.profilePic ||
                    `https://ui-avatars.com/api/?name=${property.seller?.name || "Seller"}&background=0d6e59&color=fff`
                  }
                  alt="Agent"
                  className={getClassName(s.sellerAvatarImage)}
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
              </div>
              <div className={getClassName(s.sellerDetails)}>
                <div className={getClassName(s.sellerNameLink)}>
                  <h4 className={getClassName(s.sellerName)}>
                    {property.seller?.name || "Seller"}
                  </h4>
                </div>
                <div className={getClassName(s.sellerVerifiedBadge)}>
                  <HiBadgeCheck className={getClassName(s.verifiedIcon)} /> Verified Seller
                </div>
              </div>
            </div>

            {/* 👇 Action Buttons – only Chat and Buy Property */}
            <div className="flex flex-wrap gap-2 mt-3">
              {/* Chat – visible to all logged-in users (but only buyers can chat) */}
              {user && user.role === 'buyer' && (
                <button
                  className="flex-1 min-w-[80px] bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                  onClick={handleChatStart}
                >
                  <HiChatAlt className="text-lg" /> Chat
                </button>
              )}
              {/* Buy Property – only for buyers, and only if not sold, and no pending request */}
              {user?.role === 'buyer' && property.status !== 'sold' && (
                <button
                  className="flex-1 min-w-[80px] bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  onClick={handleRequestToBuy}
                  disabled={requestStatus === 'pending'}
                >
                  <HiShoppingCart className="text-lg" />
                  {requestStatus === 'pending' ? 'Pending' : 'Buy Property'}
                </button>
              )}
            </div>

            {/* Inquiry Form */}
            <h4 className={getClassName(s.inquiryFormTitle)}>Inquire</h4>
            <form onSubmit={handleInquirySubmit}>
              {user?.role === "buyer" ? (
                <>
                  <textarea
                    placeholder="Your Message..."
                    value={inquiry.message}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, message: e.target.value })
                    }
                    className={getClassName(s.inquiryTextarea)}
                    required
                  />
                  <button
                    type="submit"
                    className={getClassName(s.inquirySubmitButton)}
                    disabled={inquiryStatus.loading}
                  >
                    {inquiryStatus.loading ? "Sending..." : "Send Inquiry"}
                  </button>
                  {inquiryStatus.success && (
                    <p className={getClassName(s.inquirySuccessMessage)}>Inquiry sent! Redirecting to chat...</p>
                  )}
                  {inquiryStatus.error && (
                    <p className={getClassName(s.inquiryErrorMessage)}>{inquiryStatus.error}</p>
                  )}
                </>
              ) : (
                <div className={getClassName(s.inquiryDisabledMessage)}>
                  <p className={getClassName(s.inquiryDisabledText)}>
                    {user
                      ? "Only buyers can send inquiries."
                      : "Please login as a buyer to send inquiries."}
                  </p>
                  {!user && (
                    <Link to="/login" className={getClassName(s.inquiryLoginButton)}>
                      Login
                    </Link>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className={getClassName(s.additionalDetails)}>
          <h3 className={getClassName(s.detailsTitle)}>Property Details</h3>
          <div className={getClassName(s.detailsGrid)}>
            {[
              { label: "Property ID", value: property._id.slice(-8).toUpperCase() },
              { label: "Added On", value: new Date(property.createdAt).toLocaleDateString() },
              { label: "Property Type", value: property.propertyType },
              { label: "Status", value: `For ${property.status}` },
            ].map((detail, i) => (
              <div key={i} className={getClassName(s.detailRow)}>
                <span className={getClassName(s.detailLabel)}>{detail.label}</span>
                <span className={getClassName(s.detailValue)}>{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        <section className={getClassName(s.similarSection)}>
          <div className={getClassName(s.similarHeader)}>
            <div>
              <h2 className={getClassName(s.similarTitle)}>Similar Properties</h2>
              <p className={getClassName(s.similarSubtitle)}>
                Listings you might like in {property.city}.
              </p>
            </div>
            <Link to="/properties" className={getClassName(s.similarAllLink)}>
              All Listings <HiChevronRight />
            </Link>
          </div>
          <div className={getClassName(s.similarGrid)}>
            {similarProperties.length > 0 ? (
              similarProperties.slice(0, 3).map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))
            ) : (
              <div className={getClassName(s.similarEmptyState)}>
                No similar properties found in this location.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PropertyDetails;