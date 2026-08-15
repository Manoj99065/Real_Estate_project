import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FaChevronUp } from 'react-icons/fa';

// Public pages
import LandingPage from './pages/shared/LandingPage';
// import Properties from './pages/shared/Properties';
import Properties from './pages/shared/Properties';
import PropertyDetails from './pages/shared/PropertyDetails';
import Home from './pages/Home';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Shared pages (buyer/seller/admin)
import Profile from './pages/shared/Profile';
import Wishlist from './pages/buyer/Wishlist';   // ✅ actual location
import Contact from './pages/shared/Contact';           // ✅ actual location
// import Messages from './pages/Messages';
import ChatMessages from './pages/shared/ChatMessages';

// Seller pages
import SellerLayout from './components/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProperty from './pages/seller/AddProperty';
import MyProperties from './pages/seller/MyProperties';
import EditProperty from './pages/seller/EditProperty';
import SellerInquiries from './pages/seller/SellerInquiries';
import SellerSupport from './pages/seller/Support';

// Buyer pages
import MyInquiries from './pages/buyer/MyInquiries';
import BuyerRequests from './pages/buyer/BuyerDashboard';




import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import SellerRequests from './pages/admin/SellerRequests';
import AdminProperties from './pages/admin/AdminProperties';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminContacts from './pages/admin/AdminContacts';
import AdminPurchaseRequests from './pages/admin/AdminPurchaseRequests';

// Auth context & route guards
// import { useAuth } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';

import { ProtectedRoute } from './components/common/ProtectedRoute';
import PublicRoute from "./components/common/PublicRoute";

// ========== Helper Components ==========

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
        visible
          ? 'scale-100 opacity-100 bg-emerald-500 text-white hover:bg-green-400'
          : 'pointer-events-none scale-0 opacity-0'
      }`}
    >
      <FaChevronUp size={22} />
    </button>
  );
};

// ========== App Component ==========

const App = () => {
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
    };
  }, []);

  return (
    <>
      <ScrollToTopOnRouteChange />
      <ScrollTopButton />

      <Routes>
  {/* ===== PUBLIC ROUTES ===== */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/seller-dashboard" element={<SellerDashboard />} />


  <Route path="/properties" element={<Properties />} />
  <Route path="/property/:id" element={<PropertyDetails />} />

  <Route path="/reset-password/:token" element={<ResetPassword />} />

  <Route path="/reset-password" element={<ResetPassword />} />

  {/* Auth routes */}
  <Route element={<PublicRoute />}>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    {/* <Route path="/reset-password" element={<ResetPassword />} /> */}



    <Route path="/verify-email" element={<VerifyEmail />} />
  </Route>

  {/* ===== PROTECTED ROUTES ===== */}
  <Route element={<ProtectedRoute />}>
    <Route path="/profile" element={<Profile />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/messages" element={<ChatMessages />} />

    {/* Buyer routes */}
    <Route path="/inquiries" element={<MyInquiries />} />
    <Route path="/seller" element={<SellerLayout />}>
    <Route path="dashboard" element={<SellerDashboard />} />
    {/* other seller routes */}
    </Route>

    {/* Seller routes */}
    <Route element={<SellerLayout />}>
      <Route path="/dashboard" element={<SellerDashboard />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/my-properties" element={<MyProperties />} />
      <Route path="/edit-property/:id" element={<EditProperty />} />
      <Route path="/leads" element={<SellerInquiries />} />
      <Route path="/support" element={<SellerSupport />} />
      <Route path="/my-requests" element={<BuyerRequests />} />
    </Route>

    {/* Admin routes */}
    <Route element={<AdminLayout />}>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/seller-requests" element={<SellerRequests />} />
      <Route path="/admin/properties" element={<AdminProperties />} />
      <Route path="/admin/inquiries" element={<AdminInquiries />} />
      <Route path="/admin/contacts" element={<AdminContacts />} />
      <Route path="/admin/purchase-requests" element={<AdminPurchaseRequests />} />

    </Route>
  </Route>

  {/* 404 – Redirect to home */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
    </>
  );
};

export default App;
