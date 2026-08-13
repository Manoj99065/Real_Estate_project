
// import React, { useEffect, useState } from "react";
// import { landingPageStyles as s } from "../../assets/dummyStyles";
// import Navbar from "../../components/common/Navbar";
// import {
//   HiLocationMarker,
//   HiOfficeBuilding,
//   HiHome,
//   HiShieldCheck,
//   HiLightningBolt,
//   HiCurrencyDollar,
//   HiVideoCamera,
//   HiMail,
//   HiPhone,
//   HiSearch,
// } from "react-icons/hi";
// import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import axios from "axios";
// import API_URL from "../../config";
// import banner from "../../assets/bannerimage.png";
// import logo from "../../assets/hexagonlogo1.png";
// import PropertyCard from "../../components/common/PropertyCard";

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const { user, token } = useAuth();
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [propertyType, setPropertyType] = useState("Select Type");
//   const [propertyCounts, setPropertyCounts] = useState({
//     flat: 0,
//     villa: 0,
//     penthouse: 0,
//     commercial: 0,
//   });

//   const [wishlistedIds, setWishlistedIds] = useState([]);

//   useEffect(() => {
//     fetchProperties();
//     fetchCounts();
//     if (user) {
//       fetchWishlist();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   // ---------- Wishlist ----------
//   const fetchWishlist = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/wishlist`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setWishlistedIds(
//         res.data
//           .filter((item) => item.property)
//           .map((item) => String(item.property._id))
//       );
//     } catch (err) {
//       console.error("Failed to fetch wishlist", err);
//     }
//   };

//   const handleToggleWishlist = async (propertyId) => {
//     try {
//       const isWishlisted = wishlistedIds.includes(propertyId);
//       if (isWishlisted) {
//         await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setWishlistedIds((prev) => prev.filter((id) => id !== propertyId));
//       } else {
//         await axios.post(
//           `${API_URL}/api/wishlist/${propertyId}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setWishlistedIds((prev) => [...prev, propertyId]);
//       }
//     } catch (err) {
//       console.error("Failed to toggle wishlist : ", err);
//     }
//   };

//   // ---------- Counts ----------
//   // const fetchCounts = async () => {
//   //   try {
//   //     const res = await axios.get(`${API_URL}/api/property/counts`);
//   //     if (res.data?.success) {
//   //       setPropertyCounts(res.data.counts);
//   //     }
//   //   } catch (err) {
//   //     console.error("Failed to fetch property counts:", err);
//   //   }
//   // };


//   const fetchCounts = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/property/counts`);
//       console.log("📡 Raw counts response:", res.data);

//       let data = res.data;
//       // Handle wrapped responses
//       if (data.success && data.counts) data = data.counts;
//       else if (data.data) data = data.data;

//       // Handle case-insensitive keys and fallback safely to 0
//       setPropertyCounts({
//         flat: data.flat || data.Flat || 0,
//         villa: data.villa || data.Villa || 0,
//         penthouse: data.penthouse || data.Penthouse || 0,
//         commercial: data.commercial || data.Commercial || 0,
//       });
//     } catch (err) {
//       console.error("Failed to fetch property counts:", err);
//     }
//   };

//   // ---------- Fetch properties ----------
//   // const fetchProperties = async (search = "") => {
//   //   try {
//   //     setLoading(true);
//   //     let url = `${API_URL}/api/property`;
//   //     if (search) {
//   //       url += `?city=${encodeURIComponent(search)}`;
//   //     }
//   //     console.log('Fetching:', url);

//   //     const token = localStorage.getItem('token') || sessionStorage.getItem('token');
//   //     const headers = token ? { Authorization: `Bearer ${token}` } : {};

//   //     const res = await axios.get(url, { headers });
//   //     const data = res.data.properties || res.data || [];
//   //     setProperties(Array.isArray(data) ? data : []);
//   //     setError(null);
//   //   } catch (err) {
//   //     console.error("Fetch error:", err);
//   //     setError("Failed to load properties. Please try again.");
//   //     setProperties([]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchProperties = async (search = "") => {
//     try {
//       setLoading(true);
//       let url = `${API_URL}/api/property`;
//       if (search) {
//         url += `?city=${encodeURIComponent(search)}`;
//       }
//       console.log('Fetching:', url);

//       const token = localStorage.getItem('token') || sessionStorage.getItem('token');
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};

//       const res = await axios.get(url, { headers });

//       // ✅ ADD THIS LINE – logs the first property
//       console.log('First property data:', res.data.properties?.[0] || res.data[0]);

//       const data = res.data.properties || res.data || [];
//       setProperties(Array.isArray(data) ? data : []);
//       setError(null);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Failed to load properties. Please try again.");
//       setProperties([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // ---------- Search handler ----------
//   const handleSearch = (e) => {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     if (searchTerm) params.append("city", searchTerm);
//     if (propertyType !== "Select Type") params.append("type", propertyType);
//     navigate(`/properties?${params.toString()}`);
//   };

//   // ---------- Static data ----------
//   const categories = [

//     {
//       name: "Modern Flats",
//       count: propertyCounts.flat || 0,
//       icon: <HiOfficeBuilding size={32} />,
//       type: "flat",
//     },
//     {
//       name: "Luxury Villas",
//       count: propertyCounts.villa || 0,
//       icon: <HiHome size={32} />,
//       type: "villa",
//     },
//     {
//       name: "Penthouse",
//       count: propertyCounts.penthouse || 0,
//       icon: <HiOfficeBuilding size={32} />,
//       type: "penthouse",
//     },
//     {
//       name: "Commercial",
//       count: propertyCounts.commercial || 0,
//       icon: <HiOfficeBuilding size={32} />,
//       type: "commercial",
//     },
//   ];

//   const features = [
//     {
//       title: "Verified Trust",
//       desc: "Every listing is strictly audited for ownership, condition, and legality.",
//       icon: <HiShieldCheck size={24} />,
//     },
//     {
//       title: "Smart Search",
//       desc: "Our AI-driven algorithms help you find the best matches based on preferences.",
//       icon: <HiLightningBolt size={24} />,
//     },
//     {
//       title: "Best Value",
//       desc: "Direct-from-owner listings and zero-commission options to ensure competitive prices.",
//       icon: <HiCurrencyDollar size={24} />,
//     },
//     {
//       title: "Virtual Tours",
//       desc: "High-definition 3D tours allow you to experience the property from home.",
//       icon: <HiVideoCamera size={24} />,
//     },
//   ];

//   // ---------- Render ----------
//   return (
//     <div className={s.bgMain}>
//       <Navbar />

//       {/* Hero Section */}
//       <section className={s.heroSection}>
//         <div className={s.heroContent}>
//           <h1 className="text-6xl font-extrabold text-primary mb-4">RealEState</h1>
//           <span className={s.badge}>TRUSTED BY 20,000+ HOMEOWNERS</span>
//           <h2 className={s.heroTitle}>
//             Find Your <span className={s.textGradient}>Perfect</span> <br />
//             Next Chapter.
//           </h2>
//           <p className={s.herosubtitle}>
//             Experience the most advanced real estate search platform. Discover
//             verified listings, connect with top agents, and find a place you'll
//             love.
//           </p>
//           <form onSubmit={handleSearch} className={s.searchForm}>
//             <div className={s.searchField}>
//               <div className={s.textPrimary}>
//                 <HiLocationMarker size={26} />
//               </div>
//               <div className={s.flexCol}>
//                 <label className={s.labelSmall}>LOCATION</label>
//                 <input
//                   type="text"
//                   placeholder="Where are you looking?"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className={s.inputTransparent}
//                 />
//               </div>
//             </div>
//             <label className={s.labelSmall}>Property Type</label>
//             <select
//               value={propertyType}
//               onChange={(e) => setPropertyType(e.target.value)}
//               className={`${s.inputTransparent} cursor-pointer`}
//             >
//               <option value="Select Type">Select Type</option>
//               <option value="flat">Flat/Apartment</option>
//               <option value="villa">Villa/House</option>
//               <option value="penthouse">Penthouse</option>
//               <option value="commercial">Commercial</option>
//             </select>
//             <button type="submit" className={s.searchButton}>
//               <HiSearch size={26} /> Search
//             </button>
//           </form>

//           <div className={s.statsContainer}>
//             <div className={s.statItemFlex}>
//               <h3 className={s.statNumber}>12k+</h3>
//               <p className={s.statLabel}>Ready Properties</p>
//             </div>
//             <div className={s.statItemBorder}>
//               <h3 className={s.statNumber}>500+</h3>
//               <p className={s.statLabel}>Agent Network</p>
//             </div>
//             <div className={s.statItemBorder}>
//               <h3 className={s.statNumber}>4.9/5</h3>
//               <p className={s.statLabel}>User Rating</p>
//             </div>
//           </div>
//         </div>

//         <div className={s.heroImageContainer}>
//           <div className={s.imageWrapper}>
//             <img src={banner} alt="banner" className={s.heroImage} />
//           </div>
//           <div className={s.verifiedBadge}>
//             <div className={s.badgeIconWrapper}>
//               <HiShieldCheck size={26} className="text-primary" />
//             </div>
//             <div className="flex flex-col">
//               <div className={s.badgeTitle}>Verified Listing</div>
//               <p className={s.badgeText}>Inspected by our Professional team</p>
//             </div>
//             <span className={s.preApproved}>Pre-Approved</span>
//           </div>
//         </div>
//       </section>

//       {/* Category Section */}
//       <section className={s.categorySection}>
//         <div className={s.container}>
//           <div className={s.categoryHeader}>
//             <div className={s.categoryHeaderText}>
//               <h2 className={s.categoryTitle}>Browse by Category</h2>
//               <p className={s.categoryDesc}>
//                 Explore curated collections of properties tailored to your specific
//                 lifestyle and needs.
//               </p>
//             </div>
//           </div>
//           <div className={s.categoryGrid}>
//             {categories.map((cat) => (
//               <div
//                 key={cat.id || cat.type}
//                 className={s.categoryCard}
//                 role="button"
//                 tabIndex={0}
//                 onClick={() => navigate(`/properties?type=${cat.type}`)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' || e.key === ' ') {
//                     e.preventDefault();
//                     navigate(`/properties?type=${cat.type}`);
//                   }
//                 }}
//               >
//                 <div className={s.categoryIconWrapper}>{cat.icon}</div>
//                 <h3 className={s.categoryName}>{cat.name}</h3>
//                 <p className={s.categoryCount}>
//                   {cat.count.toLocaleString()} Properties
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Why RealEstate */}
//       <section className={s.featuresSection}>
//         <div className={s.container}>
//           <div className={s.featuresContainer}>
//             <div className={s.featuresList}>
//               {features.map((feature, idx) => (
//                 <div key={idx} className={s.featureCard}>
//                   <div className={s.featureIconWrapper}>{feature.icon}</div>
//                   <h3 className={s.featureTitle}>{feature.title}</h3>
//                   <p className={s.featureDesc}>{feature.desc}</p>
//                 </div>
//               ))}
//             </div>
//             <div className={s.featuresContent}>
//               <h2 className={s.featuresHeading}>
//                 Why RealEstate <br /> is the <span className={s.textGradient}>Preferred Choice</span>
//               </h2>
//               <p className={s.featuresSubtext}>
//                 we've reinvented the property search experience from the ground up. By focusing on transparency, technological precision, and user-centric design, we help you find not just a house, but a home.
//               </p>
//               <ul className={s.featuresListItems}>
//                 {[
//                   "Direct connection with certified agents",
//                   "Real-time market valuation data",
//                   "Secure document management system",
//                   "24/7 Premium customer support",
//                 ].map((item, idx) => (
//                   <li key={idx} className={s.listItem}>
//                     <HiLightningBolt className="text-primary" />{item}
//                   </li>
//                 ))}
//               </ul>
//               <a href="#process" className={s.learnMoreLink}>
//                 Learn more about our process →
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="process" className={s.processSection}>
//         <div className={s.container}>
//           <div className={s.processHeader}>
//             <span className={s.processBadge}>How It Works</span>
//             <h2 className={s.processTitle}>
//               Our Seamless <span className={s.textGradient}>Process</span>
//             </h2>
//             <p className={s.processSubtitle}>
//               We've simplified the journey of finding your dream home into three
//               clear, stress-free steps.
//             </p>
//           </div>
//           <div className={s.stepsGrid}>
//             {[
//               {
//                 step: "01",
//                 title: "Smart Search",
//                 desc: "Leverage our AI-driven Smart Search algorithms to find the best property matches tailored to your specific preferences.",
//                 icon: <HiLightningBolt size={32} />,
//               },
//               {
//                 step: "02",
//                 title: "Virtual Tours",
//                 desc: "Experience your future home from anywhere with our high-definition 3D virtual tours and immersive walkthroughs.",
//                 icon: <HiVideoCamera size={32} />,
//               },
//               {
//                 step: "03",
//                 title: "Verified Trust",
//                 desc: "Every listing is strictly audited for ownership and condition, ensuring your peace of mind and a secure transaction.",
//                 icon: <HiShieldCheck size={32} />,
//               },
//             ].map((p, idx) => (
//               <div key={idx} className={s.processCard}>
//                 <div className={s.stepNumber}>{p.step}</div>
//                 <div className={s.processIconWrapper}>{p.icon}</div>
//                 <h3 className={s.processCardTitle}>{p.title}</h3>
//                 <p className={s.processCardDesc}>{p.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* == FEATURED COLLECTIONS == */}
//       <section className={s.featuredSection}>
//         <div className={s.container}>
//           <div className={`${s.featuredHeader} text-center flex flex-col items-center`}>
//             <span className={s.featuredBadge}>Handpicked for You</span>
//             <h2 className={s.featureTitle}>Featured Collections</h2>
//             <p className={s.featuredSubtitle}>
//               Discover high-value properties curated by our experts for their
//               exceptional design, location and investment potential.
//             </p>
//           </div>

//           {loading ? (
//             <div className={s.loadingContainer}>
//               <div className={s.loader}></div>
//             </div>
//           ) : error ? (
//             <div className={s.errorContainer}>
//               <p>{error}</p>
//             </div>
//           ) : (
//             <div className={s.propertiesGrid}>
//               {properties.length === 0 ? (
//                 <p className="col-span-full text-center text-gray-500">
//                   No properties available.
//                 </p>
//               ) : (
//                 properties
//                   .filter((p) => p)
//                   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//                   .slice(0, 6)
//                   .map((property) => (
//                     <PropertyCard
//                       key={property._id}
//                       property={property}
//                       isWishlisted={wishlistedIds.includes(String(property._id))}
//                       onToggleWishlist={handleToggleWishlist}
//                     />
//                   ))
//               )}
//             </div>
//           )}
//           <div className={s.discoverButtonContainer}>
//             <button
//               onClick={() => navigate("/properties")}
//               className={s.discoverButton}
//             >
//               Discover More Properties
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className={s.footer}>
//         <div className={s.container}>
//           <div className={s.footerMainGrid}>
//             <div className={s.footerBrand}>
//               <div className={s.brandLogo}>
//                 <div className={s.brandIcon}>RE</div>
//                 RealEstate
//               </div>
//               <p className={s.brandDesc}>
//                 The most trusted platform for buying, selling and renting premium
//                 real estate globally. We make property hunting seamless.
//               </p>
//               <div className={s.socialIcons}>
//                 {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
//                   (Icon, idx) => (
//                     <a href="#" key={idx} className={s.socialIcon}>
//                       <Icon size={16} />
//                     </a>
//                   )
//                 )}
//               </div>
//             </div>

//             <div>
//               <h4 className={s.footerHeading}>Company</h4>
//               <ul className={s.footerLinks}>
//                 <li><a href="/" className={s.footerLink}>Home</a></li>
//                 <li><a href="/properties" className={s.footerLink}>Property</a></li>
//                 <li><a href="/wishlist" className={s.footerLink}>Wishlist</a></li>
//                 <li><a href="/contact" className={s.footerLink}>Contact</a></li>
//               </ul>
//             </div>

//             <div>
//               <h4 className={s.footerHeading}>Support</h4>
//               <ul className={s.footerLinks}>
//                 <li className={s.contactInfo}>
//                   <HiMail className="text-primary text-xl" /> contact@reestate.com
//                 </li>
//                 <li className={s.contactInfo}>
//                   <HiPhone className="text-primary text-xl" /> +91 1234567890
//                 </li>
//                 <li className={s.contactInfoStart}>
//                   <HiLocationMarker className={`text-primary ${s.contactIcon}`} />
//                   123 Business Hub, India
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className={s.footerHeading}>Newsletter</h4>
//               <p className={s.newsletterDesc}>
//                 Subscribe to get the latest listings and market insights directly
//                 in your inbox.
//               </p>
//               <div className={s.newsletterInputWrapper}>
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   className={s.newsletterInput}
//                 />
//                 <button className={s.newsletterButton}>Join</button>
//               </div>
//             </div>
//           </div>

//           <div className={s.bottomBar}>
//             <div className={s.bottomBarFlex}>
//               <p>&copy; {new Date().getFullYear()} RealEstate. All rights reserved.</p>
//               <div className={s.footerLegalLinks}>
//                 <a href="#" className={s.footerLink}>Privacy Policy</a>
//                 <a href="#" className={s.footerLink}>Terms of Service</a>
//                 <a href="#" className={s.footerLink}>Cookies Settings</a>
//               </div>
//             </div>
//             <div className={s.designCredit}>
//               <img src={logo} alt="logo" className={s.designLogo} />
//               <span className="text-text-muted">Design By</span>
//               <a
//                 href="https://hexagondigitalservices.com/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={s.designLink}
//               >
//                 Hexagon Digital Service
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;



import React, { useEffect, useState } from "react";
import { landingPageStyles as s } from "../../assets/dummyStyles";
import Navbar from "../../components/common/Navbar";
import {
  HiLocationMarker,
  HiOfficeBuilding,
  HiHome,
  HiShieldCheck,
  HiLightningBolt,
  HiCurrencyDollar,
  HiVideoCamera,
  HiMail,
  HiPhone,
  HiSearch,
} from "react-icons/hi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import API_URL from "../../config";
import banner from "../../assets/bannerimage.png";
import logo from "../../assets/hexagonlogo1.png";
import PropertyCard from "../../components/common/PropertyCard";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("Select Type");
  const [propertyCounts, setPropertyCounts] = useState({
    flat: 0,
    villa: 0,
    penthouse: 0,
    commercial: 0,
  });

  const [wishlistedIds, setWishlistedIds] = useState([]);

  // ✅ Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchProperties();
    fetchCounts();
    if (user) {
      fetchWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ---------- Wishlist ----------
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
      console.error("Failed to fetch wishlist", err);
    }
  };

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
      console.error("Failed to toggle wishlist : ", err);
    }
  };

  // ---------- Counts ----------
  const fetchCounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/property/counts`);
      let data = res.data;
      if (data.success && data.counts) data = data.counts;
      else if (data.data) data = data.data;

      setPropertyCounts({
        flat: data.flat || data.Flat || 0,
        villa: data.villa || data.Villa || 0,
        penthouse: data.penthouse || data.Penthouse || 0,
        commercial: data.commercial || data.Commercial || 0,
      });
    } catch (err) {
      console.error("Failed to fetch property counts:", err);
    }
  };

  // ---------- Fetch properties ----------
  const fetchProperties = async (search = "") => {
    try {
      setLoading(true);
      let url = `${API_URL}/api/property`;
      if (search) {
        url += `?city=${encodeURIComponent(search)}`;
      }

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(url, { headers });
      const data = res.data.properties || res.data || [];
      setProperties(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load properties. Please try again.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Search handler ----------
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append("city", searchTerm);
    if (propertyType !== "Select Type") params.append("type", propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  // ---------- ✅ Newsletter Subscription Handler ----------
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!newsletterEmail) {
      setNewsletterMessage({ text: 'Please enter your email address.', type: 'error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    setNewsletterLoading(true);
    setNewsletterMessage({ text: '', type: '' });

    try {
      const response = await axios.post(`${API_URL}/api/newsletter/subscribe`, {
        email: newsletterEmail
      });

      if (response.data.success) {
        setNewsletterMessage({
          text: '✅ Successfully subscribed! You\'ll receive updates in your inbox.',
          type: 'success'
        });
        setNewsletterEmail('');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      setNewsletterMessage({ text: `❌ ${errorMsg}`, type: 'error' });
    } finally {
      setNewsletterLoading(false);
    }
  };

  // ---------- Static data ----------
  const categories = [
    {
      name: "Modern Flats",
      count: propertyCounts.flat || 0,
      icon: <HiOfficeBuilding size={32} />,
      type: "flat",
    },
    {
      name: "Luxury Villas",
      count: propertyCounts.villa || 0,
      icon: <HiHome size={32} />,
      type: "villa",
    },
    {
      name: "Penthouse",
      count: propertyCounts.penthouse || 0,
      icon: <HiOfficeBuilding size={32} />,
      type: "penthouse",
    },
    {
      name: "Commercial",
      count: propertyCounts.commercial || 0,
      icon: <HiOfficeBuilding size={32} />,
      type: "commercial",
    },
  ];

  const features = [
    {
      title: "Verified Trust",
      desc: "Every listing is strictly audited for ownership, condition, and legality.",
      icon: <HiShieldCheck size={24} />,
    },
    {
      title: "Smart Search",
      desc: "Our AI-driven algorithms help you find the best matches based on preferences.",
      icon: <HiLightningBolt size={24} />,
    },
    {
      title: "Best Value",
      desc: "Direct-from-owner listings and zero-commission options to ensure competitive prices.",
      icon: <HiCurrencyDollar size={24} />,
    },
    {
      title: "Virtual Tours",
      desc: "High-definition 3D tours allow you to experience the property from home.",
      icon: <HiVideoCamera size={24} />,
    },
  ];

  return (
    <div className={s.bgMain}>
      <Navbar />

      {/* Hero Section */}
      <section className={s.heroSection}>
        <div className={s.heroContent}>
          <h1 className="text-6xl font-extrabold text-primary mb-4">RealEState</h1>
          <span className={s.badge}>TRUSTED BY 20,000+ HOMEOWNERS</span>
          <h2 className={s.heroTitle}>
            Find Your <span className={s.textGradient}>Perfect</span> <br />
            Next Chapter.
          </h2>
          <p className={s.herosubtitle}>
            Experience the most advanced real estate search platform. Discover
            verified listings, connect with top agents, and find a place you'll
            love.
          </p>
          <form onSubmit={handleSearch} className={s.searchForm}>
            <div className={s.searchField}>
              <div className={s.textPrimary}>
                <HiLocationMarker size={26} />
              </div>
              <div className={s.flexCol}>
                <label className={s.labelSmall}>LOCATION</label>
                <input
                  type="text"
                  placeholder="Where are you looking?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={s.inputTransparent}
                />
              </div>
            </div>
            <label className={s.labelSmall}>Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={`${s.inputTransparent} cursor-pointer`}
            >
              <option value="Select Type">Select Type</option>
              <option value="flat">Flat/Apartment</option>
              <option value="villa">Villa/House</option>
              <option value="penthouse">Penthouse</option>
              <option value="commercial">Commercial</option>
            </select>
            <button type="submit" className={s.searchButton}>
              <HiSearch size={26} /> Search
            </button>
          </form>

          <div className={s.statsContainer}>
            <div className={s.statItemFlex}>
              <h3 className={s.statNumber}>12k+</h3>
              <p className={s.statLabel}>Ready Properties</p>
            </div>
            <div className={s.statItemBorder}>
              <h3 className={s.statNumber}>500+</h3>
              <p className={s.statLabel}>Agent Network</p>
            </div>
            <div className={s.statItemBorder}>
              <h3 className={s.statNumber}>4.9/5</h3>
              <p className={s.statLabel}>User Rating</p>
            </div>
          </div>
        </div>

        <div className={s.heroImageContainer}>
          <div className={s.imageWrapper}>
            <img src={banner} alt="banner" className={s.heroImage} />
          </div>
          <div className={s.verifiedBadge}>
            <div className={s.badgeIconWrapper}>
              <HiShieldCheck size={26} className="text-primary" />
            </div>
            <div className="flex flex-col">
              <div className={s.badgeTitle}>Verified Listing</div>
              <p className={s.badgeText}>Inspected by our Professional team</p>
            </div>
            <span className={s.preApproved}>Pre-Approved</span>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className={s.categorySection}>
        <div className={s.container}>
          <div className={s.categoryHeader}>
            <div className={s.categoryHeaderText}>
              <h2 className={s.categoryTitle}>Browse by Category</h2>
              <p className={s.categoryDesc}>
                Explore curated collections of properties tailored to your specific
                lifestyle and needs.
              </p>
            </div>
          </div>
          <div className={s.categoryGrid}>
            {categories.map((cat) => (
              <div
                key={cat.id || cat.type}
                className={s.categoryCard}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/properties?type=${cat.type}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/properties?type=${cat.type}`);
                  }
                }}
              >
                <div className={s.categoryIconWrapper}>{cat.icon}</div>
                <h3 className={s.categoryName}>{cat.name}</h3>
                <p className={s.categoryCount}>
                  {cat.count.toLocaleString()} Properties
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why RealEstate */}
      <section className={s.featuresSection}>
        <div className={s.container}>
          <div className={s.featuresContainer}>
            <div className={s.featuresList}>
              {features.map((feature, idx) => (
                <div key={idx} className={s.featureCard}>
                  <div className={s.featureIconWrapper}>{feature.icon}</div>
                  <h3 className={s.featureTitle}>{feature.title}</h3>
                  <p className={s.featureDesc}>{feature.desc}</p>
                </div>
              ))}
            </div>
            <div className={s.featuresContent}>
              <h2 className={s.featuresHeading}>
                Why RealEstate <br /> is the <span className={s.textGradient}>Preferred Choice</span>
              </h2>
              <p className={s.featuresSubtext}>
                we've reinvented the property search experience from the ground up. By focusing on transparency, technological precision, and user-centric design, we help you find not just a house, but a home.
              </p>
              <ul className={s.featuresListItems}>
                {[
                  "Direct connection with certified agents",
                  "Real-time market valuation data",
                  "Secure document management system",
                  "24/7 Premium customer support",
                ].map((item, idx) => (
                  <li key={idx} className={s.listItem}>
                    <HiLightningBolt className="text-primary" />{item}
                  </li>
                ))}
              </ul>
              <a href="#process" className={s.learnMoreLink}>
                Learn more about our process →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="process" className={s.processSection}>
        <div className={s.container}>
          <div className={s.processHeader}>
            <span className={s.processBadge}>How It Works</span>
            <h2 className={s.processTitle}>
              Our Seamless <span className={s.textGradient}>Process</span>
            </h2>
            <p className={s.processSubtitle}>
              We've simplified the journey of finding your dream home into three
              clear, stress-free steps.
            </p>
          </div>
          <div className={s.stepsGrid}>
            {[
              {
                step: "01",
                title: "Smart Search",
                desc: "Leverage our AI-driven Smart Search algorithms to find the best property matches tailored to your specific preferences.",
                icon: <HiLightningBolt size={32} />,
              },
              {
                step: "02",
                title: "Virtual Tours",
                desc: "Experience your future home from anywhere with our high-definition 3D virtual tours and immersive walkthroughs.",
                icon: <HiVideoCamera size={32} />,
              },
              {
                step: "03",
                title: "Verified Trust",
                desc: "Every listing is strictly audited for ownership and condition, ensuring your peace of mind and a secure transaction.",
                icon: <HiShieldCheck size={32} />,
              },
            ].map((p, idx) => (
              <div key={idx} className={s.processCard}>
                <div className={s.stepNumber}>{p.step}</div>
                <div className={s.processIconWrapper}>{p.icon}</div>
                <h3 className={s.processCardTitle}>{p.title}</h3>
                <p className={s.processCardDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className={s.featuredSection}>
        <div className={s.container}>
          <div className={`${s.featuredHeader} text-center flex flex-col items-center`}>
            <span className={s.featuredBadge}>Handpicked for You</span>
            <h2 className={s.featureTitle}>Featured Collections</h2>
            <p className={s.featuredSubtitle}>
              Discover high-value properties curated by our experts for their
              exceptional design, location and investment potential.
            </p>
          </div>

          {loading ? (
            <div className={s.loadingContainer}>
              <div className={s.loader}></div>
            </div>
          ) : error ? (
            <div className={s.errorContainer}>
              <p>{error}</p>
            </div>
          ) : (
            <div className={s.propertiesGrid}>
              {properties.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">
                  No properties available.
                </p>
              ) : (
                properties
                  .filter((p) => p)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 6)
                  .map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      isWishlisted={wishlistedIds.includes(String(property._id))}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))
              )}
            </div>
          )}
          <div className={s.discoverButtonContainer}>
            <button
              onClick={() => navigate("/properties")}
              className={s.discoverButton}
            >
              Discover More Properties
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.container}>
          <div className={s.footerMainGrid}>
            <div className={s.footerBrand}>
              <div className={s.brandLogo}>
                <div className={s.brandIcon}>RE</div>
                RealEstate
              </div>
              <p className={s.brandDesc}>
                The most trusted platform for buying, selling and renting premium
                real estate globally. We make property hunting seamless.
              </p>
              <div className={s.socialIcons}>
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                  (Icon, idx) => (
                    <a href="#" key={idx} className={s.socialIcon}>
                      <Icon size={16} />
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className={s.footerHeading}>Company</h4>
              <ul className={s.footerLinks}>
                <li><a href="/" className={s.footerLink}>Home</a></li>
                <li><a href="/properties" className={s.footerLink}>Property</a></li>
                <li><a href="/wishlist" className={s.footerLink}>Wishlist</a></li>
                <li><a href="/contact" className={s.footerLink}>Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className={s.footerHeading}>Support</h4>
              <ul className={s.footerLinks}>
                <li className={s.contactInfo}>
                  <HiMail className="text-primary text-xl" /> contact@realestate.com  {/* ✅ FIXED */}
                </li>
                <li className={s.contactInfo}>
                  <HiPhone className="text-primary text-xl" /> +91 98765 43210  {/* ✅ CHANDIGARH NUMBER */}
                </li>
                <li className={s.contactInfoStart}>
                  <HiLocationMarker className={`text-primary ${s.contactIcon}`} />
                  Sector 17, Chandigarh, India  {/* ✅ UPDATED */}
                </li>
              </ul>
            </div>

            <div>
              <h4 className={s.footerHeading}>Newsletter</h4>
              <p className={s.newsletterDesc}>
                Subscribe to get the latest listings and market insights directly
                in your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className={s.newsletterInputWrapper}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={s.newsletterInput}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterLoading}
                  required
                />
                <button
                  type="submit"
                  className={s.newsletterButton}
                  disabled={newsletterLoading}
                >
                  {newsletterLoading ? '...' : 'Join'}
                </button>
              </form>
              {newsletterMessage.text && (
                <div className={`mt-2 text-xs ${
                  newsletterMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {newsletterMessage.text}
                </div>
              )}
            </div>
          </div>

          <div className={s.bottomBar}>
            <div className={s.bottomBarFlex}>
              <p>&copy; {new Date().getFullYear()} RealEstate. All rights reserved.</p>
              <div className={s.footerLegalLinks}>
                <a href="#" className={s.footerLink}>Privacy Policy</a>
                <a href="#" className={s.footerLink}>Terms of Service</a>
                <a href="#" className={s.footerLink}>Cookies Settings</a>
              </div>
            </div>
            <div className={s.designCredit}>
              <img src={logo} alt="logo" className={s.designLogo} />
              <span className="text-text-muted">Design By</span>
              <span className={s.designLink}>
                Manoj Thakur  {/* ✅ UPDATED */}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;