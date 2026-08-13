import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineSupport,
  HiOutlineLogout,
  HiOutlineChat,
} from 'react-icons/hi';
import { sellerSidebarStyles as s } from '../assets/dummyStyles';
import { useAuth } from '../context/AuthContext';
import Logo from './common/Logo';

const SellerSidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: HiOutlineViewGrid, path: '/dashboard' },
    { name: 'My Listings', icon: HiOutlineClipboardList, path: '/my-properties' },
    { name: 'Leads', icon: HiOutlineChartBar, path: '/leads' }, // ✅ Changed from /inquiries to /leads
    { name: 'Messages', icon: HiOutlineChat, path: '/messages' }, // ✅ Changed to /messages
    { name: 'Profile', icon: HiOutlineUser, path: '/profile' },
    { name: 'Support', icon: HiOutlineSupport, path: '/support' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${s.backdrop} ${isOpen ? s.backdropVisible : s.backdropHidden}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`${s.sidebar} ${isOpen ? s.sidebarOpen : s.sidebarClosed}`}>
        <div className={s.logoContainer}>
          <Logo fontSize="1.25rem" iconSize={20} />
        </div>

        <nav className={s.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `${s.navLink} ${isActive ? s.navLinkActive : s.navLinkInactive}`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className={s.logoutContainer}>
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className={s.logoutButton}
          >
            <HiOutlineLogout size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;